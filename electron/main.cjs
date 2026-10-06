const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const { autoUpdater } = require('electron-updater');

let mainWindow = null;
let serverProcess = null;

const PORT = process.env.PORT || 3001;
const DEV_URL = process.env.ELECTRON_DEV_URL || 'http://localhost:5173';
const IS_DEV = process.env.NODE_ENV === 'development';

// -------------------------------------------------------------
// Auto-Updater Configuration (GitHub Releases)
// -------------------------------------------------------------
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function setupAutoUpdater() {
  if (IS_DEV || !app.isPackaged) {
    console.log('[AutoUpdater] Skipped in development mode.');
    return;
  }

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates on GitHub...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] New update found:', info.version);
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[AutoUpdater] Application is on latest version.');
  });

  autoUpdater.on('error', (err) => {
    console.warn('[AutoUpdater] Update check failed or skipped:', err.message);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`[AutoUpdater] Download: ${Math.round(progressObj.percent)}% (${Math.round(progressObj.bytesPerSecond / 1024)} KB/s)`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded:', info.version);
    if (mainWindow) {
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

  // Check for updates 3 seconds after application boots
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.warn('[AutoUpdater] Background check error:', err.message);
    });
  }, 3000);
}

// -------------------------------------------------------------
// Backend Express Server Management
// -------------------------------------------------------------
function checkServerReady(port, callback) {
  const req = http.get(`http://localhost:${port}/api/tree`, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(500, () => {
    req.destroy();
    callback(false);
  });
}

function startBackendServer(callback) {
  checkServerReady(PORT, (isReady) => {
    if (isReady) {
      console.log(`[Electron] Backend is already active on port ${PORT}`);
      callback();
      return;
    }

    console.log(`[Electron] Spawning Express backend on port ${PORT}...`);
    const serverScript = path.join(__dirname, '..', 'server', 'index.js');
    const isPackaged = app.isPackaged;
    const nodeExecutable = isPackaged ? process.execPath : 'node';
    const envOptions = isPackaged
      ? { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: PORT.toString() }
      : { ...process.env, PORT: PORT.toString() };

    serverProcess = spawn(nodeExecutable, [serverScript], {
      cwd: path.join(__dirname, '..'),
      env: envOptions,
      stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
      console.error('[Electron] Backend process error:', err);
    });

    let attempts = 40;
    const interval = setInterval(() => {
      checkServerReady(PORT, (ready) => {
        if (ready || attempts <= 0) {
          clearInterval(interval);
          callback();
        }
        attempts--;
      });
    }, 200);
  });
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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    setupAutoUpdater();
  });

  if (IS_DEV) {
    mainWindow.loadURL(DEV_URL);
  } else {
    mainWindow.loadURL(`http://localhost:${PORT}`);
  }

  // External links opened in system browser
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

app.whenReady().then(() => {
  startBackendServer(() => {
    createWindow();
  });

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
  if (serverProcess && !serverProcess.killed) {
    console.log('[Electron] Terminating backend server...');
    serverProcess.kill();
  }
});
