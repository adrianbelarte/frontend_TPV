// frontend/electron/main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import http from 'node:http';
import https from 'node:https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let backendProcess = null;

function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL;
}

function startBackend() {
  const backendEntryDev = path.resolve(__dirname, '../../backend/server.js');
  const backendEntryProd = path.join(process.resourcesPath, 'backend', 'server.js');

  const entry = isDev() ? backendEntryDev : backendEntryProd;
  const cwd = isDev() ? path.resolve(__dirname, '../../backend') : path.join(process.resourcesPath, 'backend');

  // Spawn the node backend
  backendProcess = spawn('node', [entry], {
    cwd,
    shell: true,
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('Error arrancando backend:', err);
  });

  backendProcess.on('exit', (code, signal) => {
    console.log('Backend finalizó con', { code, signal });
  });
}

/**
 * Wait until a URL returns a 2xx/3xx response.
 * backendUrl: string, e.g. 'http://localhost:3000/health'
 * timeoutMs: total timeout
 * intervalMs: polling interval
 */
function waitForBackend(backendUrl = 'http://localhost:3000/', timeoutMs = 15000, intervalMs = 200) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function attempt() {
      // parse URL
      let url;
      try {
        url = new URL(backendUrl);
      } catch (err) {
        return reject(new Error('URL de backend inválida: ' + backendUrl));
      }

      const lib = url.protocol === 'https:' ? https : http;

      const req = lib.request(
        {
          method: 'GET',
          hostname: url.hostname,
          port: url.port,
          path: url.pathname || '/',
          timeout: 2000,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
            resolve();
          } else {
            // not ready, retry
            if (Date.now() - start > timeoutMs) {
              reject(new Error('Timeout esperando backend (status ' + res.statusCode + ')'));
            } else {
              setTimeout(attempt, intervalMs);
            }
          }
          res.resume();
        }
      );

      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Timeout esperando backend (connection error)'));
        } else {
          setTimeout(attempt, intervalMs);
        }
      });

      req.on('timeout', () => {
        req.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Timeout esperando backend (request timeout)'));
        } else {
          setTimeout(attempt, intervalMs);
        }
      });

      req.end();
    }

    attempt();
  });
}

async function createWindow() {
  if (mainWindow) return;

  // Start backend first
  startBackend();

  // Wait for backend to be ready (or timeout)
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000/'; // puedes ajustar puerto
  try {
    await waitForBackend(backendUrl, 15000, 200); // 15s timeout
    console.log('Backend listo: ', backendUrl);
  } catch (err) {
    console.warn('Backend no respondió a tiempo, la app intentará seguir de todos modos:', err.message);
    // seguimos para no bloquear completamente la app
  }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev()
    ? process.env.ELECTRON_START_URL || 'http://localhost:5173'
    : `file://${path.join(process.resourcesPath, 'dist', 'index.html')}`;

  console.log('Cargando URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // abrir devtools en dev; en prod puedes comentarlo o dejar para debugging temporal
  if (isDev()) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) {
      try {
        backendProcess.kill();
      } catch (e) {
        console.warn('Error cerrando backendProcess:', e);
      }
    }
  });
}

// single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  });
}
