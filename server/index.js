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
const PORT = 3001;

// Define workspace path
const WORKSPACE_DIR = path.resolve(__dirname, '..', 'workspace');

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

    fs.renameSync(targetOld, targetNew);
    res.json({ success: true, message: 'Renamed successfully' });
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

  if (customCmd) {
    command = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    args = process.platform === 'win32' ? ['/c', customCmd] : ['-c', customCmd];
    sendEvent('stdout', `> ${customCmd}\n`);
  } else if (filePathParam) {
    const fullPath = getSafePath(filePathParam);
    const ext = path.extname(fullPath).toLowerCase();
    const fileName = path.basename(fullPath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const fileDir = path.dirname(fullPath);

    sendEvent('stdout', `> [Nemesis Runner] Menjalankan ${fileName}...\n----------------------------------------\n`);

    if (ext === '.py') {
      command = 'python';
      args = [fullPath];
    } else if (ext === '.js' || ext === '.mjs') {
      command = 'node';
      args = [fullPath];
    } else if (ext === '.ts') {
      // Node 22+ supports strip types natively
      command = 'node';
      args = ['--experimental-strip-types', fullPath];
    } else if (ext === '.java') {
      // In Java 11+, single-file source code programs can be run directly with `java <file.java>`!
      command = 'java';
      args = [fullPath];
    } else if (ext === '.dart') {
      command = 'dart';
      args = ['run', fullPath];
    } else if (ext === '.ps1') {
      command = 'powershell.exe';
      args = ['-ExecutionPolicy', 'Bypass', '-File', fullPath];
    } else if (ext === '.bat' || ext === '.cmd') {
      command = 'cmd.exe';
      args = ['/c', fullPath];
    } else if (ext === '.sh') {
      const gitBash = 'E:\\Git\\bin\\bash.exe';
      if (fs.existsSync(gitBash)) {
        command = gitBash;
        args = [fullPath];
      } else {
        command = 'bash';
        args = [fullPath];
      }
    } else if (ext === '.c') {
      command = 'cmd.exe';
      const outExe = path.join(fileDir, `${fileNameWithoutExt}.exe`);
      args = ['/c', `gcc "${fullPath}" -o "${outExe}" && "${outExe}"`];
    } else if (ext === '.cpp' || ext === '.cc') {
      command = 'cmd.exe';
      const outExe = path.join(fileDir, `${fileNameWithoutExt}.exe`);
      args = ['/c', `g++ "${fullPath}" -o "${outExe}" && "${outExe}"`];
    } else if (ext === '.go') {
      command = 'go';
      args = ['run', fullPath];
    } else if (ext === '.rs') {
      command = 'cmd.exe';
      const outExe = path.join(fileDir, `${fileNameWithoutExt}.exe`);
      args = ['/c', `rustc "${fullPath}" -o "${outExe}" && "${outExe}"`];
    } else if (ext === '.php') {
      command = 'php';
      args = [fullPath];
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

  const child = spawn(command, args, {
    cwd: WORKSPACE_DIR,
    shell: true,
  });

  child.stdout.on('data', (chunk) => {
    sendEvent('stdout', chunk.toString());
  });

  child.stderr.on('data', (chunk) => {
    sendEvent('stderr', chunk.toString());
  });

  child.on('error', (err) => {
    sendEvent('stderr', `Process error: ${err.message}\n`);
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

app.listen(PORT, () => {
  console.log(`Nemesis IDE Backend berjalan di http://localhost:${PORT}`);
  console.log(`Workspace folder: ${WORKSPACE_DIR}`);
});
