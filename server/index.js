import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { getTemplateForFile } from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const userHome = process.env.USERPROFILE || process.env.HOME || '.';
const configDir = path.join(userHome, '.nemesis-ide');
const configFile = path.join(configDir, 'workspace.json');

function loadSavedWorkspace() {
  try {
    if (fs.existsSync(configFile)) {
      const data = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      if (data.workspace && fs.existsSync(data.workspace) && fs.statSync(data.workspace).isDirectory()) {
        return path.resolve(data.workspace);
      }
    }
  } catch (e) {
    console.warn('[Workspace] Failed to load saved config:', e.message);
  }
  return null;
}

function saveWorkspace(dir) {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(configFile, JSON.stringify({ workspace: dir }, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Workspace] Failed to save config:', e.message);
  }
}

// Define workspace path (defaults to saved workspace, or local workspace folder)
const savedWorkspace = loadSavedWorkspace();
let WORKSPACE_DIR = savedWorkspace || path.resolve(__dirname, '..', 'workspace');
if (!savedWorkspace && __dirname.includes('app.asar')) {
  WORKSPACE_DIR = path.join(userHome, 'NemesisIDE_Workspace');
}

// Ensure workspace directory exists
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Helper: validate and resolve safe paths inside WORKSPACE_DIR
function getSafePath(relativePath) {
  const safeRelative = (relativePath || '').replace(/^(\.\.[\/\\])+/, '');
  const targetPath = path.resolve(WORKSPACE_DIR, safeRelative);
  if (!targetPath.startsWith(WORKSPACE_DIR)) {
    throw new Error('Access denied: path outside workspace.');
  }
  return targetPath;
}

// Recursively get file tree
function getFileTree(dir, relativeTo = WORKSPACE_DIR) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  return sortedEntries
    .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules' && !entry.name.endsWith('.class'))
    .map(entry => {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(relativeTo, fullPath).replace(/\\/g, '/');
      const isDir = entry.isDirectory();

      return {
        name: entry.name,
        path: relPath,
        type: isDir ? 'directory' : 'file',
        children: isDir ? getFileTree(fullPath, relativeTo) : null
      };
    });
}

// 0. Get current active workspace
app.get('/api/workspace', (req, res) => {
  res.json({
    success: true,
    path: WORKSPACE_DIR,
    name: path.basename(WORKSPACE_DIR) || WORKSPACE_DIR,
  });
});

// 0. Set active workspace directory
app.post('/api/workspace', (req, res) => {
  try {
    const { dir } = req.body;
    if (!dir) return res.status(400).json({ error: 'Direktori folder wajib diisi.' });

    const targetDir = path.resolve(dir);
    if (!fs.existsSync(targetDir)) {
      return res.status(404).json({ error: 'Folder tidak ditemukan di sistem.' });
    }
    if (!fs.statSync(targetDir).isDirectory()) {
      return res.status(400).json({ error: 'Jalur yang dipilih bukan merupakan folder direktori.' });
    }

    WORKSPACE_DIR = targetDir;
    saveWorkspace(WORKSPACE_DIR);

    res.json({
      success: true,
      message: 'Workspace berhasil diganti',
      path: WORKSPACE_DIR,
      name: path.basename(WORKSPACE_DIR) || WORKSPACE_DIR,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 0. Open native folder browser dialog via PowerShell fallback (if not in Electron)
app.post('/api/workspace/pick', (req, res) => {
  if (process.platform === 'win32') {
    const psScript = `
      Add-Type -AssemblyName System.Windows.Forms
      $f = New-Object System.Windows.Forms.FolderBrowserDialog
      $f.Description = "Pilih Folder Project untuk Nemesis IDE"
      $f.ShowNewFolderButton = $true
      if ($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        Write-Output $f.SelectedPath
      }
    `;
    const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript]);
    let out = '';
    child.stdout.on('data', d => out += d);
    child.on('close', () => {
      const selected = out.trim();
      if (selected && fs.existsSync(selected) && fs.statSync(selected).isDirectory()) {
        WORKSPACE_DIR = path.resolve(selected);
        saveWorkspace(WORKSPACE_DIR);
        return res.json({
          success: true,
          path: WORKSPACE_DIR,
          name: path.basename(WORKSPACE_DIR) || WORKSPACE_DIR
        });
      }
      res.json({ success: false, message: 'Pemilihan folder dibatalkan.' });
    });
  } else {
    res.status(400).json({ error: 'Native dialog fallback hanya didukung di Windows.' });
  }
});

// 1. Get workspace directory tree
app.get('/api/tree', (req, res) => {
  try {
    const tree = getFileTree(WORKSPACE_DIR);
    res.json({ success: true, tree });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Read file content
app.get('/api/file', (req, res) => {
  try {
    const filePath = getSafePath(req.query.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return res.status(400).json({ success: false, error: 'Target is a directory' });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ success: true, content, path: req.query.path, name: path.basename(filePath) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Save / overwrite file
app.post('/api/file', (req, res) => {
  try {
    const { path: reqPath, content } = req.body;
    if (!reqPath) return res.status(400).json({ error: 'Path is required' });
    const filePath = getSafePath(reqPath);
    
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content ?? '', 'utf8');
    res.json({ success: true, message: 'File saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create new file or folder
app.post('/api/create', (req, res) => {
  try {
    const { path: reqPath, type } = req.body;
    if (!reqPath) return res.status(400).json({ error: 'Path is required' });
    const targetPath = getSafePath(reqPath);

    if (fs.existsSync(targetPath)) {
      return res.status(400).json({ success: false, error: 'Item already exists' });
    }

    if (type === 'directory') {
      fs.mkdirSync(targetPath, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      const fileName = path.basename(targetPath);
      const templateContent = getTemplateForFile(fileName);
      fs.writeFileSync(targetPath, templateContent, 'utf8');
    }

    res.json({ success: true, message: `${type} created successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete file or folder
app.post('/api/delete', (req, res) => {
  try {
    const { path: reqPath } = req.body;
    const targetPath = getSafePath(reqPath);

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Rename file or folder
app.post('/api/rename', (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    const targetOld = getSafePath(oldPath);
    const targetNew = getSafePath(newPath);

    if (!fs.existsSync(targetOld)) {
      return res.status(404).json({ error: 'Source not found' });
    }
    if (fs.existsSync(targetNew)) {
      return res.status(400).json({ error: 'Target name already exists' });
    }

    fs.mkdirSync(path.dirname(targetNew), { recursive: true });
    fs.renameSync(targetOld, targetNew);
    res.json({ success: true, message: 'Renamed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Move file or folder into another directory
app.post('/api/move', (req, res) => {
  try {
    const { sourcePath, targetDir } = req.body;
    if (!sourcePath) return res.status(400).json({ error: 'sourcePath is required' });

    const cleanSource = sourcePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const cleanTargetDir = (targetDir || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');

    // Prevent moving a folder into itself or its descendants
    if (cleanTargetDir === cleanSource || cleanTargetDir.startsWith(cleanSource + '/')) {
      return res.status(400).json({ error: 'Tidak dapat memindahkan folder ke dalam dirinya sendiri.' });
    }

    const sourceFullPath = getSafePath(cleanSource);
    const itemName = path.basename(sourceFullPath);
    const destDirFullPath = getSafePath(cleanTargetDir);
    const destFullPath = path.join(destDirFullPath, itemName);

    if (!fs.existsSync(sourceFullPath)) {
      return res.status(404).json({ error: 'Item sumber tidak ditemukan.' });
    }
    if (sourceFullPath === destFullPath) {
      return res.json({ success: true, message: 'Item sudah berada di lokasi tujuan.' });
    }
    if (fs.existsSync(destFullPath)) {
      return res.status(400).json({ error: `Item "${itemName}" sudah ada di folder tujuan.` });
    }

    fs.mkdirSync(destDirFullPath, { recursive: true });
    fs.renameSync(sourceFullPath, destFullPath);

    res.json({ success: true, message: 'Item berhasil dipindahkan.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Multi-Language Runner (Streaming via SSE)
app.get('/api/run', (req, res) => {
  const filePathParam = req.query.path;
  const customCmd = req.query.cmd;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
  };

  let command = '';
  let args = [];
  let runCwd = WORKSPACE_DIR;
  let useShell = false;

  if (customCmd) {
    command = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    args = process.platform === 'win32' ? ['/c', customCmd] : ['-c', customCmd];
    runCwd = WORKSPACE_DIR;
    useShell = false;
    sendEvent('stdout', `> ${customCmd}\n`);
  } else if (filePathParam) {
    const fullPath = getSafePath(filePathParam);
    const ext = path.extname(fullPath).toLowerCase();
    const fileName = path.basename(fullPath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const fileDir = path.dirname(fullPath);
    runCwd = fileDir;

    sendEvent('stdout', `> [Nemesis Runner] Menjalankan ${fileName}...\n----------------------------------------\n`);

    if (ext === '.py') {
      command = 'python';
      args = [fileName];
    } else if (ext === '.js' || ext === '.mjs') {
      command = 'node';
      args = [fileName];
    } else if (ext === '.ts' || ext === '.tsx' || ext === '.jsx') {
      command = 'node';
      const tsxCli = path.resolve(__dirname, '..', 'node_modules', 'tsx', 'dist', 'cli.mjs');
      if (fs.existsSync(tsxCli)) {
        args = [tsxCli, fileName];
      } else {
        args = ['--experimental-strip-types', fileName];
      }
    } else if (ext === '.java') {
      // In Java 11+, single-file source code programs can be run directly with `java <file.java>`!
      command = 'java';
      args = [fileName];
    } else if (ext === '.dart') {
      command = 'dart';
      args = ['run', fileName];
      useShell = process.platform === 'win32';
    } else if (ext === '.ps1') {
      command = 'powershell.exe';
      args = ['-ExecutionPolicy', 'Bypass', '-File', fileName];
    } else if (ext === '.bat' || ext === '.cmd') {
      command = 'cmd.exe';
      args = ['/c', fileName];
    } else if (ext === '.sh') {
      const gitBash = 'E:\\Git\\bin\\bash.exe';
      if (fs.existsSync(gitBash)) {
        command = gitBash;
        args = [fileName];
      } else {
        command = 'bash';
        args = [fileName];
      }
    } else if (ext === '.c') {
      command = 'cmd.exe';
      const outExe = `${fileNameWithoutExt}.exe`;
      const qFile = fileName.includes(' ') ? `"${fileName}"` : fileName;
      const qExe = outExe.includes(' ') ? `"${outExe}"` : outExe;
      args = ['/c', `gcc ${qFile} -o ${qExe} && ${qExe}`];
    } else if (ext === '.cpp' || ext === '.cc') {
      command = 'cmd.exe';
      const outExe = `${fileNameWithoutExt}.exe`;
      const qFile = fileName.includes(' ') ? `"${fileName}"` : fileName;
      const qExe = outExe.includes(' ') ? `"${outExe}"` : outExe;
      args = ['/c', `g++ ${qFile} -o ${qExe} && ${qExe}`];
    } else if (ext === '.go') {
      command = 'go';
      args = ['run', fileName];
    } else if (ext === '.rs') {
      command = 'cmd.exe';
      const outExe = `${fileNameWithoutExt}.exe`;
      const qFile = fileName.includes(' ') ? `"${fileName}"` : fileName;
      const qExe = outExe.includes(' ') ? `"${outExe}"` : outExe;
      args = ['/c', `rustc ${qFile} -o ${qExe} && ${qExe}`];
    } else if (ext === '.php') {
      command = 'php';
      args = [fileName];
    } else {
      sendEvent('stderr', `Ekstensi "${ext}" belum memiliki konfigurasi runner otomatis.\nAnda dapat menjalankan perintah kustom lewat input terminal di bawah.\n`);
      sendEvent('exit', { code: 1 });
      res.end();
      return;
    }
  } else {
    sendEvent('stderr', 'Tidak ada file atau perintah yang dipilih.\n');
    sendEvent('exit', { code: 1 });
    res.end();
    return;
  }

  const knownBinPaths = [
    'E:\\msys64\\ucrt64\\bin',
    'E:\\msys64\\usr\\bin',
    'C:\\msys64\\ucrt64\\bin',
    'C:\\msys64\\usr\\bin',
    'E:\\Flutter\\flutter_windows_3.47.5-stable\\flutter\\bin',
  ].filter(p => fs.existsSync(p));

  const currentPath = process.env.PATH || process.env.Path || '';
  const augmentedPath = knownBinPaths.length > 0
    ? `${knownBinPaths.join(';')};${currentPath}`
    : currentPath;

  const spawnEnv = {
    ...process.env,
    PATH: augmentedPath,
    Path: augmentedPath,
    PYTHONIOENCODING: 'utf-8',
    PYTHONUTF8: '1',
    PYTHONUNBUFFERED: '1',
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
  };

  const isWinCmd = process.platform === 'win32' && (command === 'cmd.exe' || command === 'cmd');

  const child = spawn(command, args, {
    cwd: runCwd,
    env: spawnEnv,
    shell: useShell,
    windowsVerbatimArguments: isWinCmd,
  });

  child.stdout.on('data', (chunk) => {
    sendEvent('stdout', chunk.toString());
  });

  child.stderr.on('data', (chunk) => {
    sendEvent('stderr', chunk.toString());
  });

  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      const toolNames = {
        php: { name: 'PHP', url: 'https://windows.php.net/download/' },
        go: { name: 'Go (Golang)', url: 'https://go.dev/dl/' },
        python: { name: 'Python', url: 'https://www.python.org/downloads/' },
        py: { name: 'Python', url: 'https://www.python.org/downloads/' },
        rustc: { name: 'Rust (rustc/cargo)', url: 'https://www.rust-lang.org/tools/install' },
        gcc: { name: 'GCC (MinGW / C Compiler)', url: 'https://winlibs.com/' },
        'g++': { name: 'G++ (MinGW / C++ Compiler)', url: 'https://winlibs.com/' },
        dart: { name: 'Dart SDK', url: 'https://dart.dev/get-dart' },
        java: { name: 'Java JDK', url: 'https://adoptium.net/' },
        node: { name: 'Node.js', url: 'https://nodejs.org/' }
      };
      const info = toolNames[command] || { name: command, url: '' };
      sendEvent('stderr', `\n⚠️ [Runtime Not Found] Program "${info.name}" tidak ditemukan di komputer Anda (PATH)!\n\n` +
        `Penyebab: Bahasa ini membutuhkan compiler/interpreter "${command}" yang belum terpasang di sistem operasi Windows Anda.\n` +
        (info.url ? `Download & Install: ${info.url}\n\n` : '\n') +
        `Catatan: Setelah menginstall ${info.name}, restart Nemesis IDE agar PATH baru terbaca otomatis.\n`);
    } else {
      sendEvent('stderr', `Process error: ${err.message}\n`);
    }
    sendEvent('exit', { code: -1 });
    res.end();
  });

  child.on('close', (code) => {
    sendEvent('stdout', `\n----------------------------------------\nProses selesai dengan kode keluar: ${code}\n`);
    sendEvent('exit', { code });
    res.end();
  });

  req.on('close', () => {
    if (!child.killed) {
      child.kill();
    }
  });
});

// Serve frontend build if dist folder exists (for production & Electron desktop app)
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Export app and server starter function
export { app };

export function startServer(port = PORT) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`[Backend] Nemesis IDE berjalan di http://localhost:${port}`);
      console.log(`[Backend] Workspace folder: ${WORKSPACE_DIR}`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[Backend] Port ${port} sudah aktif.`);
        resolve(null);
      } else {
        console.error('[Backend] Gagal memulai server:', err);
        resolve(null);
      }
    });
  });
}

// Auto-run jika dieksekusi langsung via node server/index.js (bukan di-import oleh Electron)
if (!process.versions.electron) {
  startServer(PORT);
}
