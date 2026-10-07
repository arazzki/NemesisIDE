import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import FileIcon from './FileIcon';

// Helper to extract HTML hierarchy around line number
function getHtmlHierarchy(content, lineNum) {
  if (!content) return [];
  const lines = content.split('\n');
  const targetLines = lines.slice(0, Math.min(lineNum, lines.length));
  
  const stack = [];
  const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)>|<\/([a-zA-Z0-9\-]+)>/g;

  for (let l = 0; l < targetLines.length; l++) {
    const line = targetLines[l];
    let match;
    while ((match = tagRegex.exec(line)) !== null) {
      const isClosing = Boolean(match[3]);
      const tagName = (match[1] || match[3] || '').toLowerCase();
      
      // Void HTML elements
      const isVoid = ['meta', 'link', 'img', 'br', 'hr', 'input', '!doctype'].includes(tagName);

      if (isClosing) {
        if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
          stack.pop();
        }
      } else if (!isVoid && !match[0].endsWith('/>')) {
        const rawAttrs = match[2] || '';
        let className = '';
        let idName = '';
        
        const classMatch = rawAttrs.match(/class=["']([^"']+)["']/);
        if (classMatch) {
          className = classMatch[1].split(' ')[0];
        }
        const idMatch = rawAttrs.match(/id=["']([^"']+)["']/);
        if (idMatch) {
          idName = idMatch[1];
        }

        let label = tagName;
        if (idName) label += `#${idName}`;
        else if (className) label += `.${className}`;

        stack.push({ tag: tagName, label, line: l + 1 });
      }
    }
  }

  return stack;
}

// Helper for JS/TS/Python hierarchy
function getCodeHierarchy(content, lineNum, ext) {
  if (!content) return [];
  const lines = content.split('\n');
  const targetLines = lines.slice(0, Math.min(lineNum, lines.length));
  const stack = [];

  for (let l = 0; l < targetLines.length; l++) {
    const line = targetLines[l];
    
    // JS/TS function or class
    const fnMatch = line.match(/(?:function\s+([a-zA-Z0-9_$]+)|class\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>)/);
    if (fnMatch) {
      const name = fnMatch[1] || fnMatch[2] || fnMatch[3];
      if (name) stack.push({ label: name, line: l + 1 });
    }

    // Python def or class
    if (ext === 'py') {
      const pyMatch = line.match(/^\s*(?:def|class)\s+([a-zA-Z0-9_]+)/);
      if (pyMatch) {
        stack.push({ label: pyMatch[1], line: l + 1 });
      }
    }
  }

  // Keep last 3 symbols
  return stack.slice(-3);
}

export default function Breadcrumbs({ activeFile, cursorPosition, onNavigateLine }) {
  if (!activeFile) return null;

  const ext = activeFile.path.split('.').pop().toLowerCase();
  const pathParts = activeFile.path.split('/');
  const dirParts = pathParts.slice(0, -1);
  const fileName = pathParts[pathParts.length - 1];

  let symbols = [];
  if (['html', 'htm'].includes(ext)) {
    symbols = getHtmlHierarchy(activeFile.content, cursorPosition?.line || 1);
  } else if (['js', 'jsx', 'ts', 'tsx', 'py'].includes(ext)) {
    symbols = getCodeHierarchy(activeFile.content, cursorPosition?.line || 1, ext);
  }

  return (
    <div className="h-[22px] min-h-[22px] bg-[#181818] border-b border-[#2d2d2d] flex items-center justify-between px-3 text-[11px] text-[#9d9d9d] select-none z-10 font-sans">
      {/* Left: Breadcrumbs chain */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {/* Workspace directory parts */}
        {dirParts.map((folder, idx) => (
          <React.Fragment key={idx}>
            <span className="hover:text-[#cccccc] cursor-pointer hover:underline transition-colors">
              {folder}
            </span>
            <ChevronRight size={12} className="text-[#6e6e6e] shrink-0" />
          </React.Fragment>
        ))}

        {/* Current File Item with accurate icon */}
        <div className="flex items-center space-x-1 text-[#cccccc] font-medium hover:text-white cursor-pointer group">
          <FileIcon filename={fileName} size={14} />
          <span className="group-hover:underline">{fileName}</span>
        </div>

        {/* Hierarchy / Tag Symbols (e.g. html > body > nav.navbar) */}
        {symbols.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={12} className="text-[#6e6e6e] shrink-0" />
            <button
              onClick={() => onNavigateLine && onNavigateLine(item.line)}
              title={`Pergi ke baris ${item.line}`}
              className="hover:text-[#ffffff] text-[#a0a0a0] cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded transition-colors flex items-center space-x-0.5"
            >
              <span>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Text Editor label */}
      <div className="flex items-center space-x-2 text-[11px] text-[#808080] shrink-0">
        <span className="hover:text-[#cccccc] cursor-pointer flex items-center space-x-1">
          <span>Text Editor</span>
        </span>
      </div>
    </div>
  );
}
