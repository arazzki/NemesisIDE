const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let serverProcess = null;

const PORT = process.env.PORT || 3001;
const DEV_URL = process.env.ELECTRON_DEV_URL || 'http://localhost:5173';
const IS_DEV = process.env.NODE_ENV === 'development';

// Check if Express backend is responding
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

// Start backend Express server if not already running
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#18181b',
    title: 'Nemesis IDE',
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
  });

  // Load URL
  if (IS_DEV) {
    mainWindow.loadURL(DEV_URL);
  } else {
    mainWindow.loadURL(`http://localhost:${PORT}`);
  }

  // Open external links in default system browser
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
