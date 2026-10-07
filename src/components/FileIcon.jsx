import React from 'react';
import { 
  FileCode, FileText, Image, FileJson, Coffee, 
  Terminal, Sparkles, Folder, FolderOpen, Globe
} from 'lucide-react';

export default function FileIcon({ filename, isDirectory, isOpen, size = 15, className = '' }) {
  if (isDirectory) {
    return isOpen ? (
      <FolderOpen size={size} className={`text-[#dcb67a] shrink-0 ${className}`} />
    ) : (
      <Folder size={size} className={`text-[#dcb67a] shrink-0 ${className}`} />
    );
  }

  const ext = (filename || '').split('.').pop().toLowerCase();

  // HTML: orange tag icon `<>`
  if (ext === 'html' || ext === 'htm') {
    return (
      <span 
        style={{ fontSize: `${Math.max(10, size - 2)}px` }} 
        className={`font-mono font-bold text-[#e44d26] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
        title="HTML"
      >
        &lt;&gt;
      </span>
    );
  }

  // CSS: blue `#` hash icon
  if (ext === 'css') {
    return (
      <span 
        style={{ fontSize: `${Math.max(11, size - 1)}px` }} 
        className={`font-mono font-bold text-[#42a5f5] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
        title="CSS"
      >
        #
      </span>
    );
  }

  // SCSS / SASS / LESS: pink `#`
  if (ext === 'scss' || ext === 'sass' || ext === 'less') {
    return (
      <span 
        style={{ fontSize: `${Math.max(11, size - 1)}px` }} 
        className={`font-mono font-bold text-[#cf649a] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
        title="SCSS"
      >
        #
      </span>
    );
  }

  // JS: yellow `JS`
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    return (
      <span 
        style={{ fontSize: `${Math.max(9, size - 4)}px` }} 
        className={`font-mono font-extrabold text-[#e5a00d] bg-[#f7df1e]/10 border border-[#f7df1e]/30 px-0.5 rounded-[2px] shrink-0 leading-none inline-flex items-center justify-center h-[13px] select-none ${className}`}
        title="JavaScript"
      >
        JS
      </span>
    );
  }

  // TS: blue `TS`
  if (ext === 'ts') {
    return (
      <span 
        style={{ fontSize: `${Math.max(9, size - 4)}px` }} 
        className={`font-mono font-extrabold text-[#3178c6] bg-[#3178c6]/10 border border-[#3178c6]/30 px-0.5 rounded-[2px] shrink-0 leading-none inline-flex items-center justify-center h-[13px] select-none ${className}`}
        title="TypeScript"
      >
        TS
      </span>
    );
  }

  // JSX: cyan atom / React
  if (ext === 'jsx') {
    return (
      <span 
        style={{ fontSize: `${Math.max(8, size - 5)}px` }} 
        className={`font-mono font-extrabold text-[#00d8ff] bg-[#00d8ff]/10 border border-[#00d8ff]/30 px-0.5 rounded-[2px] shrink-0 leading-none inline-flex items-center justify-center h-[13px] select-none ${className}`}
        title="React JSX"
      >
        JSX
      </span>
    );
  }

  // TSX: cyan/blue React
  if (ext === 'tsx') {
    return (
      <span 
        style={{ fontSize: `${Math.max(8, size - 5)}px` }} 
        className={`font-mono font-extrabold text-[#29b6f6] bg-[#29b6f6]/10 border border-[#29b6f6]/30 px-0.5 rounded-[2px] shrink-0 leading-none inline-flex items-center justify-center h-[13px] select-none ${className}`}
        title="React TSX"
      >
        TSX
      </span>
    );
  }

  // JSON: yellow `{ }`
  if (ext === 'json') {
    return (
      <span 
        style={{ fontSize: `${Math.max(10, size - 2)}px` }} 
        className={`font-mono font-bold text-[#cbcb41] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
        title="JSON"
      >
        &#123;&#125;
      </span>
    );
  }

  // Python: blue/yellow
  if (ext === 'py') {
    return (
      <span 
        style={{ fontSize: `${Math.max(9, size - 4)}px` }} 
        className={`font-mono font-extrabold text-[#3776ab] bg-[#ffd43b]/10 border border-[#3776ab]/30 px-0.5 rounded-[2px] shrink-0 leading-none inline-flex items-center justify-center h-[13px] select-none ${className}`}
        title="Python"
      >
        Py
      </span>
    );
  }

  // Java: orange cup
  if (ext === 'java') {
    return <Coffee size={size} className={`text-[#e76f00] shrink-0 ${className}`} />;
  }

  // C / C++
  if (ext === 'c' || ext === 'h') {
    return (
      <span 
        style={{ fontSize: `${Math.max(9, size - 4)}px` }} 
        className={`font-mono font-bold text-[#659ad2] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
      >
        C
      </span>
    );
  }
  if (ext === 'cpp' || ext === 'hpp' || ext === 'cc' || ext === 'cxx') {
    return (
      <span 
        style={{ fontSize: `${Math.max(8, size - 5)}px` }} 
        className={`font-mono font-bold text-[#00599c] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
      >
        C++
      </span>
    );
  }

  // Markdown
  if (ext === 'md' || ext === 'markdown') {
    return (
      <span 
        style={{ fontSize: `${Math.max(9, size - 4)}px` }} 
        className={`font-mono font-bold text-[#42a5f5] shrink-0 leading-none inline-flex items-center justify-center w-[15px] h-[15px] select-none ${className}`}
        title="Markdown"
      >
        M&#8595;
      </span>
    );
  }

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp'].includes(ext)) {
    return <Image size={size} className={`text-[#b388ff] shrink-0 ${className}`} />;
  }

  // Shell / Scripts
  if (['sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd'].includes(ext)) {
    return <Terminal size={size} className={`text-[#aeea00] shrink-0 ${className}`} />;
  }

  // Git / Config
  if (filename.startsWith('.git') || ext === 'gitignore') {
    return <FileCode size={size} className={`text-[#f4511e] shrink-0 ${className}`} />;
  }

  // Plain text
  if (ext === 'txt') {
    return <FileText size={size} className={`text-[#90a4ae] shrink-0 ${className}`} />;
  }

  return <FileCode size={size} className={`text-[#90a4ae] shrink-0 ${className}`} />;
}
