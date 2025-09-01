import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import isDev from 'electron-is-dev';

let mainWindow;
let backendProcess;

function createWindow() {
  if (mainWindow) return;

  // Levantar backend automáticamente si no estamos en desarrollo
  const backendPath = path.resolve(__dirname, '../../backend/server.js');
  backendProcess = spawn('node', [backendPath], {
    cwd: path.resolve(__dirname, '../../backend'),
    shell: true,
    stdio: 'inherit'
  });

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // URL de desarrollo o producción
  const startUrl = isDev
    ? 'http://localhost:5173' // Ajusta al puerto que usa Vite
    : `file://${path.join(process.resourcesPath, 'dist', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) backendProcess.kill(); // Cierra backend al salir
  });
}

// Evitar múltiples instancias
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

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', createWindow);
}
