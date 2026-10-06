export function getLanguageFromPath(filePath) {
  if (!filePath) return 'plaintext';
  const ext = filePath.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'py':
      return 'python';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'java':
      return 'java';
    case 'dart':
      return 'dart';
    case 'c':
      return 'c';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'h':
    case 'hpp':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    case 'json':
      return 'json';
    case 'xml':
    case 'svg':
      return 'xml';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'ps1':
      return 'powershell';
    case 'bat':
    case 'cmd':
      return 'bat';
    case 'lua':
      return 'lua';
    case 'r':
      return 'r';
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'swift':
      return 'swift';
    default:
      return 'plaintext';
  }
}

export function getFileBadgeColor(filePath) {
  const ext = (filePath || '').split('.').pop().toLowerCase();
  switch (ext) {
    case 'py':
      return 'text-yellow-400 bg-yellow-400';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'text-amber-300 bg-amber-300';
    case 'ts':
      return 'text-blue-400 bg-blue-400';
    case 'jsx':
    case 'tsx':
      return 'text-cyan-300 bg-cyan-300';
    case 'java':
      return 'text-orange-500 bg-orange-500';
    case 'dart':
      return 'text-cyan-400 bg-cyan-400';
    case 'c':
    case 'cpp':
    case 'h':
      return 'text-blue-500 bg-blue-500';
    case 'cs':
      return 'text-purple-400 bg-purple-400';
    case 'go':
      return 'text-sky-400 bg-sky-400';
    case 'rs':
      return 'text-amber-600 bg-amber-600';
    case 'php':
      return 'text-indigo-400 bg-indigo-400';
    case 'rb':
      return 'text-rose-500 bg-rose-500';
    case 'html':
      return 'text-orange-400 bg-orange-400';
    case 'css':
    case 'scss':
      return 'text-pink-400 bg-pink-400';
    case 'json':
      return 'text-emerald-400 bg-emerald-400';
    case 'markdown':
    case 'md':
      return 'text-teal-300 bg-teal-300';
    case 'sh':
    case 'bash':
      return 'text-lime-400 bg-lime-400';
    case 'ps1':
      return 'text-sky-300 bg-sky-300';
    case 'bat':
    case 'cmd':
      return 'text-stone-300 bg-stone-300';
    case 'sql':
      return 'text-indigo-300 bg-indigo-300';
    case 'yaml':
    case 'yml':
      return 'text-rose-400 bg-rose-400';
    case 'xml':
      return 'text-emerald-300 bg-emerald-300';
    default:
      return 'text-zinc-400 bg-zinc-400';
  }
}

export function getLanguageName(filePath) {
  const ext = (filePath || '').split('.').pop().toLowerCase();
  const names = {
    py: 'Python',
    js: 'JavaScript',
    ts: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    java: 'Java',
    dart: 'Dart',
    c: 'C',
    cpp: 'C++',
    cs: 'C#',
    go: 'Go',
    rs: 'Rust',
    php: 'PHP',
    rb: 'Ruby',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    md: 'Markdown',
    sh: 'Bash Script',
    ps1: 'PowerShell',
    bat: 'Batch',
    sql: 'SQL',
    yaml: 'YAML',
    xml: 'XML'
  };
  return names[ext] || getLanguageFromPath(filePath);
}
