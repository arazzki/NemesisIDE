import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Define workspace path
const WORKSPACE_DIR = path.resolve(__dirname, '..', 'workspace');

// Ensure workspace directory exists and seed initial demo files if empty
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

// Seed initial files if workspace is empty
if (fs.readdirSync(WORKSPACE_DIR).length === 0) {
  fs.writeFileSync(
    path.join(WORKSPACE_DIR, 'main.py'),
    `# Selamat datang di IDE buatan Anda sendiri!\n\ndef sapa(nama):\n    return f"Halo {nama}, selamat mencoba IDE kustom ini!"\n\ndef hitung_fibonacci(n):\n    deret = [0, 1]\n    for i in range(2, n):\n        deret.append(deret[-1] + deret[-2])\n    return deret\n\nif __name__ == "__main__":\n    print(sapa("Developer"))\n    print("\\nDeret Fibonacci 10 angka pertama:")\n    print(hitung_fibonacci(10))\n`
  );

  fs.writeFileSync(
    path.join(WORKSPACE_DIR, 'index.js'),
    `// JavaScript Runner Test\nconsole.log("🚀 Menjalankan JavaScript di Custom IDE...");\n\nconst items = [\n  { id: 1, name: "Editor Engine (Monaco)", status: "Active" },\n  { id: 2, name: "File System API", status: "Connected" },\n  { id: 3, name: "Integrated Runner", status: "Ready" }\n];\n\nconsole.table(items);\nconsole.log("Waktu sekarang:", new Date().toLocaleTimeString());\n`
  );

  fs.writeFileSync(
    path.join(WORKSPACE_DIR, 'README.md'),
    `# 🚀 Selamat Datang di Custom IDE Anda!\n\nIni adalah workspace lokal Anda. Anda dapat:\n- Membuat file & folder baru lewat Sidebar\n- Mengedit kode dengan auto-complete (Monaco Editor)\n- Simpan file dengan \`Ctrl + S\`\n- Klik tombol **Run Code** (Segitiga Hijau) di atas atau di terminal untuk menjalankan script ini secara live!\n\nCoba buka file \`main.py\` atau \`index.js\` lalu klik tombol **Run**!`
  );
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
  
  // Sort directories first, then files
  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  return sortedEntries
    .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules')
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
    
    // Ensure parent directory exists
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
      fs.writeFileSync(targetPath, '', 'utf8');
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

// 7. Execute code / run file (Streaming via SSE)
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
    
    if (ext === '.py') {
      command = 'python';
      args = [fullPath];
    } else if (ext === '.js' || ext === '.mjs') {
      command = 'node';
      args = [fullPath];
    } else {
      sendEvent('stderr', `Unsupported executable format: ${ext}. Support: .py, .js\n`);
      sendEvent('exit', { code: 1 });
      res.end();
      return;
    }
    sendEvent('stdout', `> Menjalankan ${path.basename(fullPath)}...\n----------------------------------------\n`);
  } else {
    sendEvent('stderr', 'No file or command specified.\n');
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
  console.log(`Backend server IDE berjalan di http://localhost:${PORT}`);
  console.log(`Workspace folder: ${WORKSPACE_DIR}`);
});
