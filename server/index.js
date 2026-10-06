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

// Ensure workspace directory exists and seed initial demo files
if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

// Function to seed demo files for multiple languages if not present
function seedDemoFiles() {
  const files = [
    {
      name: 'main.py',
      content: `# Python Demo di Nemesis IDE\n\ndef sapa(nama: str) -> str:\n    return f"Halo {nama}, selamat datang di Nemesis IDE!"\n\ndef hitung_fibonacci(n: int) -> list[int]:\n    deret = [0, 1]\n    for _ in range(2, n):\n        deret.append(deret[-1] + deret[-2])\n    return deret\n\nif __name__ == "__main__":\n    print(sapa("Developer"))\n    print("\\nDeret Fibonacci 10 angka pertama:")\n    print(hitung_fibonacci(10))\n`
    },
    {
      name: 'index.js',
      content: `// JavaScript Demo di Nemesis IDE\nconsole.log("🚀 Menjalankan script JavaScript di Nemesis IDE...\\n");\n\nconst modules = [\n  { id: 1, name: "Monaco Editor Engine", status: "Active" },\n  { id: 2, name: "Multi-Language Runner", status: "Enabled" },\n  { id: 3, name: "Vivid Syntax Themes", status: "Ready" }\n];\n\nconsole.table(modules);\nconsole.log("\\nWaktu eksekusi:", new Date().toLocaleTimeString());\n`
    },
    {
      name: 'App.java',
      content: `// Java 21 Demo di Nemesis IDE\npublic class App {\n    public static void main(String[] args) {\n        System.out.println("☕ Halo dari Java di Nemesis IDE!");\n        System.out.println("Java Version: " + System.getProperty("java.version"));\n        \n        int sum = 0;\n        for (int i = 1; i <= 5; i++) {\n            sum += i;\n            System.out.println("Step " + i + ": sum = " + sum);\n        }\n        \n        System.out.println("Total penjumlahan: " + sum);\n    }\n}\n`
    },
    {
      name: 'main.dart',
      content: `// Dart Demo di Nemesis IDE\nvoid main() {\n  print('🎯 Halo dari Dart di Nemesis IDE!');\n  \n  final languages = ['Python', 'JavaScript', 'Java', 'Dart', 'TypeScript'];\n  print('Bahasa yang didukung:');\n  for (final lang in languages) {\n    print('  - ' + lang);\n  }\n  \n  final now = DateTime.now();\n  print('\\nTimestamp: \${now.toIso8601String()}');\n}\n`
    },
    {
      name: 'script.ps1',
      content: `# PowerShell Script Demo di Nemesis IDE\nWrite-Host "⚡ Menjalankan PowerShell di Nemesis IDE!" -ForegroundColor Cyan\n$info = Get-Date\nWrite-Host "Waktu saat ini: $info" -ForegroundColor Green\nWrite-Host "OS: $((Get-CimInstance Win32_OperatingSystem).Caption)" -ForegroundColor Yellow\n`
    },
    {
      name: 'hello.bat',
      content: `@echo off\necho ======================================\necho   Halo dari Windows Batch Script!\necho   Nemesis IDE Multi-Language Runner\necho ======================================\necho Selesai.\n`
    },
    {
      name: 'README.md',
      content: `# ⚡ Selamat Datang di Nemesis IDE!\n\nNemesis IDE kini mendukung pewarnaan sintaks kaya warna dan runner multi-bahasa!\n\n### Coba buka dan jalankan file berikut:\n- **\`main.py\`**: Python script\n- **\`index.js\`**: JavaScript script\n- **\`App.java\`**: Java program\n- **\`main.dart\`**: Dart program\n- **\`script.ps1\`**: PowerShell script\n- **\`hello.bat\`**: Windows Batch file\n\nKlik tombol hijau **Run Code** di pojok kanan atas untuk menjalankannya langsung di panel Terminal!`
    }
  ];

  for (const f of files) {
    const full = path.join(WORKSPACE_DIR, f.name);
    if (!fs.existsSync(full)) {
      fs.writeFileSync(full, f.content, 'utf8');
    }
  }
}

seedDemoFiles();

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
