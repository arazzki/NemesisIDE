const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const http = require('http');
const { pathToFileURL } = require('url');

let mainWindow = null;
let activeServer = null;

const PORT = process.env.PORT || 3001;
const DEV_URL = process.env.ELECTRON_DEV_URL || 'http://localhost:5173';
const IS_DEV = process.env.NODE_ENV === 'development';

// -------------------------------------------------------------
// Auto-Updater Configuration (GitHub Releases)
// -------------------------------------------------------------
function setupAutoUpdater() {
  if (IS_DEV || !app.isPackaged) {
    return;
  }

  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['Restart & Terapkan', 'Nanti Saja'],
        defaultId: 0,
        cancelId: 1,
        title: 'Pembaruan Siap Dipasang ⚡',
        message: `Versi baru Nemesis IDE (v${info.version}) berhasil diunduh!`,
        detail: 'Apakah Anda ingin me-restart Nemesis IDE sekarang untuk memasang pembaruan otomatis?'
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    }
  });

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }, 4000);
  } catch (err) {
    console.warn('[AutoUpdater] Failed to initialize:', err);
  }
}

// -------------------------------------------------------------
// Backend Express Server Management (In-Process)
// -------------------------------------------------------------
function checkServerResponding(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/tree`, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(400, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureBackendServer() {
  const isAlreadyRunning = await checkServerResponding(PORT);
  if (isAlreadyRunning) {
    console.log(`[Electron] Backend server already responsive on port ${PORT}`);
    return;
  }

  console.log(`[Electron] Initializing in-process backend server on port ${PORT}...`);
  try {
    const serverPath = path.join(__dirname, '..', 'server', 'index.js');
    const serverModule = await import(pathToFileURL(serverPath).href);
    if (typeof serverModule.startServer === 'function') {
      activeServer = await serverModule.startServer(PORT);
      console.log(`[Electron] In-process backend server started.`);
    }
  } catch (err) {
    console.error('[Electron] Error loading backend server:', err);
  }
}

// -------------------------------------------------------------
// Main Window Lifecycle
// -------------------------------------------------------------
function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#18181b',
    title: 'Nemesis IDE',
    icon: iconPath,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false
    }
  });

  const targetURL = IS_DEV ? DEV_URL : `http://localhost:${PORT}`;

  // Retry on load failure if server had slight startup delay
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.warn(`[Electron] Load failed: ${errorDescription} (${errorCode}). Retrying...`);
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(targetURL);
      }
    }, 800);
  });

  // F12 toggles DevTools for developer debugging
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    setupAutoUpdater();
  });

  mainWindow.loadURL(targetURL);

  // External links open in default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await ensureBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (activeServer && typeof activeServer.close === 'function') {
    activeServer.close();
  }
});
