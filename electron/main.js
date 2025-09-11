import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import http from 'node:http';
import https from 'node:https';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let backendProcess = null;

// Detecta entorno de desarrollo
function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL;
}

// Arranca el backend
function startBackend() {
  const backendEntryDev = path.resolve(__dirname, '../../backend/app.js');
  const backendEntryProd = path.join(process.resourcesPath, 'backend', 'app.js');

  const entry = isDev() ? backendEntryDev : backendEntryProd;
  const cwd = isDev() ? path.resolve(__dirname, '../../backend') : path.join(process.resourcesPath, 'backend');

  console.log('🔎 Backend entry:', entry);
  console.log('🔎 Backend cwd:', cwd);
  console.log('📂 ¿Existe backend?', fs.existsSync(entry));

  backendProcess = spawn('node', [entry], { cwd, shell: true, stdio: 'inherit' });

  backendProcess.on('error', (err) => console.error('❌ Error arrancando backend:', err));
  backendProcess.on('exit', (code, signal) => console.log('⚠️ Backend finalizó con', { code, signal }));
}

// Espera a que el backend responda
function waitForBackend(url = 'http://localhost:3000/', timeoutMs = 15000, intervalMs = 200) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function attempt() {
      let parsedUrl;
      try { parsedUrl = new URL(url); } 
      catch { return reject(new Error('URL de backend inválida: ' + url)); }

      const lib = parsedUrl.protocol === 'https:' ? https : http;
      const req = lib.request(
        { method: 'GET', hostname: parsedUrl.hostname, port: parsedUrl.port, path: parsedUrl.pathname || '/', timeout: 2000 },
        (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) resolve();
          else if (Date.now() - start > timeoutMs) reject(new Error('Timeout backend (status ' + res.statusCode + ')'));
          else setTimeout(attempt, intervalMs);
          res.resume();
        }
      );
      req.on('error', () => Date.now() - start > timeoutMs ? reject(new Error('Timeout backend (connection error)')) : setTimeout(attempt, intervalMs));
      req.on('timeout', () => { req.destroy(); if(Date.now()-start>timeoutMs) reject(new Error('Timeout backend (request timeout)')); else setTimeout(attempt, intervalMs); });
      req.end();
    }
    attempt();
  });
}

// Crea la ventana de Electron
async function createWindow() {
  if (mainWindow) return;

  startBackend();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000/';
  try { await waitForBackend(backendUrl); console.log('✅ Backend listo:', backendUrl); }
  catch (err) { console.warn('⚠️ Backend no respondió a tiempo:', err.message); }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  // URL frontend
  const startUrl = isDev()
    ? process.env.ELECTRON_START_URL || 'http://localhost:5173'
    : `file://${path.join(process.resourcesPath, 'app', 'dist', 'index.html')}`;

  console.log('🔎 startUrl:', startUrl);
  console.log('📂 ¿Existe index.html?', fs.existsSync(path.join(process.resourcesPath, 'app', 'dist', 'index.html')));

  mainWindow.loadURL(startUrl);

  if (isDev()) mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) {
      try { backendProcess.kill(); } 
      catch (e) { console.warn('⚠️ Error cerrando backendProcess:', e); }
    }
  });
}

// Evita múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();
else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('activate', () => { if (!mainWindow) createWindow(); });
}
