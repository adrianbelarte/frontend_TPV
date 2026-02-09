// frontend/electron/main.js (ESM)
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa app.isPackaged para distinguir build vs dev
const isDev = !app.isPackaged;
const VITE_DEV_SERVER = process.env.VITE_DEV_SERVER || 'http://localhost:5173';

let backendProc = null;
function waitForBackend({ url = 'http://127.0.0.1:3000/api/health', tries = 20, intervalMs = 500 } = {}) {
  return new Promise((resolve, reject) => {
    let attempt = 0;
    const tick = () => {
      attempt++;
      // Intento HTTP sencillo a /health
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          res.resume(); // drena
          return resolve(true);
        }
        res.resume();
        if (attempt >= tries) return reject(new Error(`Backend no responde: ${url} (HTTP ${res.statusCode})`));
        setTimeout(tick, intervalMs);
      });
      req.on('error', () => {
        if (attempt >= tries) return reject(new Error(`Backend no responde: ${url}`));
        setTimeout(tick, intervalMs);
      });
      req.setTimeout(300, () => { req.destroy(new Error('timeout')); });
    };
    tick();
  });
}

/** Devuelve la primera ruta de entry del backend que exista */
function resolveBackendEntry() {
  // Candidatos típicos de entry
  const candidates = isDev
    ? [
        path.join(__dirname, '..', '..', 'backend', 'server.js'),
        path.join(__dirname, '..', '..', 'backend', 'app.js'),
        path.join(__dirname, '..', '..', 'backend', 'index.js'),
      ]
    : [
        path.join(process.resourcesPath, 'backend', 'server.js'),
        path.join(process.resourcesPath, 'backend', 'app.js'),
        path.join(process.resourcesPath, 'backend', 'index.js'),
        // fallback a ruta local si por algún motivo no se copió bien
        path.join(__dirname, '..', '..', 'backend', 'server.js'),
        path.join(__dirname, '..', '..', 'backend', 'app.js'),
        path.join(__dirname, '..', '..', 'backend', 'index.js'),
      ];

  for (const f of candidates) {
    if (fs.existsSync(f)) return f;
  }
  return null;
}

/** Arranca el backend, si existe entry */
function startBackend() {
  const entry = resolveBackendEntry();
  console.log('[Electron] backend entry:', entry);
  if (!entry) {
    console.error('[Electron] No se encontró el entry del backend (server.js / app.js / index.js).');
    return;
  }

  // ⚠️ Directorio del backend (packaged o local)
  const backendDir = path.dirname(entry);

  // Rutas absolutas para recursos críticos cuando está empaquetado
  const sqlitePath =
    process.env.SQLITE_STORAGE_PATH ||
    (app.isPackaged
      ? path.join(process.resourcesPath, 'backend', 'database.sqlite')
      : path.join(backendDir, 'database.sqlite'));

  const uploadsDir =
    process.env.UPLOADS_DIR ||
    (app.isPackaged
      ? path.join(process.resourcesPath, 'backend', 'uploads')
      : path.join(backendDir, 'uploads'));

  const env = {
    ...process.env,
    NODE_ENV: app.isPackaged ? 'production' : 'development',
    PORT: process.env.BACKEND_PORT || '3000',

    // 👇 impresora (ajústalo si hace falta)
    PRINTER_MOCK: process.env.PRINTER_MOCK ?? 'false',
    PRINTER_HOST: process.env.PRINTER_HOST || '192.168.1.100',
    PRINTER_PORT: process.env.PRINTER_PORT || '9100',
    PRINTER_ENCODING: process.env.PRINTER_ENCODING || 'CP437',
    PRINTER_LINE_WIDTH: process.env.PRINTER_LINE_WIDTH || '32',

    // 👇 rutas absolutas para que Sequelize/Express no fallen
    SQLITE_STORAGE_PATH: sqlitePath,
    UPLOADS_DIR: uploadsDir,
  };

  console.log('[Electron] backend cwd:', backendDir);
  console.log('[Electron] env.SQLITE_STORAGE_PATH:', env.SQLITE_STORAGE_PATH);
  console.log('[Electron] env.UPLOADS_DIR:', env.UPLOADS_DIR);

  try {
    backendProc = fork(entry, [], {
      env,
      stdio: 'pipe',
      cwd: backendDir, // 👈 MUY IMPORTANTE: el hijo verá rutas relativas desde /backend
    });
    backendProc.on('spawn', () => console.log('[Electron] backend spawn OK:', entry));
    backendProc.on('exit', (code) => console.log('[Electron] backend exit:', code));
    backendProc.stdout?.on('data', (d) => process.stdout.write(`[BE] ${d}`));
    backendProc.stderr?.on('data', (d) => process.stderr.write(`[BE] ${d}`));
  } catch (e) {
    console.error('[Electron] error starting backend:', e);
  }
}

function stopBackend() {
  try { if (backendProc && !backendProc.killed) backendProc.kill('SIGTERM'); }
  catch (e) { console.warn('[Electron] error stopping backend:', e.message); }
  finally { backendProc = null; }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const preloadPath = path.join(__dirname, 'preload.cjs');
  console.log('[Electron] preload path:', preloadPath, 'exists:', fs.existsSync(preloadPath));

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('[Electron] did-fail-load', { code, desc, url });
    win.webContents.openDevTools({ mode: 'detach' });
  });
  win.webContents.on('did-finish-load', () => {
    console.log('[Electron] did-finish-load');
    win.show();
    // Deja esto activo hasta que todo funcione; luego lo quitas
    win.webContents.openDevTools({ mode: 'detach' });
  });
  win.webContents.on('console-message', (_e, level, message) => {
    console.log(`[Renderer:${level}]`, message);
  });

  if (isDev) {
  startBackend();
  waitForBackend({ url: 'http://127.0.0.1:3000/api/health', tries: 80, intervalMs: 250 })
    .catch((e) => console.warn('[Electron] backend tarda en levantar (dev):', e.message))
    .finally(async () => {
      await new Promise(r => setTimeout(r, 400)); // 👍 colchón extra
      console.log('[Electron] Loading dev server:', VITE_DEV_SERVER);
      win.loadURL(VITE_DEV_SERVER);
    });
} else {
  startBackend();
  waitForBackend({ url: 'http://127.0.0.1:3000/api/health', tries: 80, intervalMs: 250 })
    .catch((e) => console.warn('[Electron] backend tarda en levantar (prod):', e.message))
    .finally(async () => {
      await new Promise(r => setTimeout(r, 400)); // 👍 colchón extra
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      console.log('[Electron] Loading file:', indexPath);
      win.loadFile(indexPath);
    });
}

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    stopBackend();
    if (process.platform !== 'darwin') app.quit();
  });
}

ipcMain.handle('ping', async () => 'pong');
