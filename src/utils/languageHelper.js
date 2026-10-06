export function getLanguageFromPath(filePath) {
  if (!filePath) return 'plaintext';
  const ext = filePath.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'json':
      return 'json';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
      return 'css';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
    case 'ps1':
    case 'bat':
      return 'shell';
    case 'xml':
    case 'svg':
      return 'xml';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      return 'plaintext';
  }
}

export function getFileBadgeColor(filePath) {
  const lang = getLanguageFromPath(filePath);
  switch (lang) {
    case 'python':
      return 'text-yellow-400';
    case 'javascript':
      return 'text-amber-300';
    case 'typescript':
      return 'text-blue-400';
    case 'json':
      return 'text-emerald-400';
    case 'markdown':
      return 'text-sky-300';
    case 'html':
      return 'text-orange-400';
    case 'css':
      return 'text-cyan-400';
    default:
      return 'text-zinc-400';
  }
}
