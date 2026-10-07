import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, ArrowRight, Folder, FileCode, Check } from 'lucide-react';
import FileIcon from './FileIcon';

export default function CommandPalette({
  isOpen,
  onClose,
  initialMode = 'files', // 'files' or 'commands'
  tree = [],
  onOpenFile,
  onOpenFolder,
  onNewFile,
  onNewFolder,
  onSaveFile,
  onRunCode,
  onToggleTerminal,
  onToggleSidebar,
  onToggleMinimap,
  onToggleWordWrap,
  onSelectView,
  editorSettings,
  setEditorSettings
}) {
  const [query, setQuery] = useState(initialMode === 'commands' ? '>' : '');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialMode === 'commands' ? '>' : '');
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (initialMode === 'commands') {
            inputRef.current.setSelectionRange(1, 1);
          }
        }
      }, 50);
    }
  }, [isOpen, initialMode]);

  // Flatten tree to get all files
  const allFiles = React.useMemo(() => {
    const list = [];
    function traverse(nodes) {
      if (!nodes) return;
      for (const node of nodes) {
        if (node.type === 'file') {
          list.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    }
    traverse(tree);
    return list;
  }, [tree]);

  // Available commands
  const allCommands = React.useMemo(() => [
    { id: 'file:new', category: 'File', label: 'New File...', shortcut: 'Ctrl+N', action: () => onNewFile && onNewFile() },
    { id: 'file:new-folder', category: 'File', label: 'New Folder...', shortcut: '', action: () => onNewFolder && onNewFolder() },
    { id: 'file:open-folder', category: 'File', label: 'Open Folder...', shortcut: 'Ctrl+O', action: () => onOpenFolder && onOpenFolder() },
    { id: 'file:save', category: 'File', label: 'Save Active File', shortcut: 'Ctrl+S', action: () => onSaveFile && onSaveFile() },
    { id: 'view:explorer', category: 'View', label: 'Show Explorer', shortcut: 'Ctrl+Shift+E', action: () => onSelectView('explorer') },
    { id: 'view:search', category: 'View', label: 'Show Search in Files', shortcut: 'Ctrl+Shift+F', action: () => onSelectView('search') },
    { id: 'view:git', category: 'View', label: 'Show Source Control', shortcut: 'Ctrl+Shift+G', action: () => onSelectView('source-control') },
    { id: 'view:terminal', category: 'View', label: 'Toggle Integrated Terminal', shortcut: 'Ctrl+`', action: () => onToggleTerminal() },
    { id: 'view:sidebar', category: 'View', label: 'Toggle Primary Side Bar', shortcut: 'Ctrl+B', action: () => onToggleSidebar() },
    { id: 'view:minimap', category: 'View', label: 'Toggle Minimap', shortcut: '', action: () => onToggleMinimap() },
    { id: 'view:wordwrap', category: 'View', label: 'Toggle Word Wrap', shortcut: 'Alt+Z', action: () => onToggleWordWrap() },
    { id: 'run:code', category: 'Run', label: 'Run Current File', shortcut: 'F5', action: () => onRunCode() },
    { id: 'theme:dark-modern', category: 'Preferences', label: 'Color Theme: VS Code Dark Modern', shortcut: '', action: () => setEditorSettings && setEditorSettings(s => ({ ...s, theme: 'vs-dark-modern' })) },
    { id: 'theme:nemesis', category: 'Preferences', label: 'Color Theme: Nemesis Dark (Vivid)', shortcut: '', action: () => setEditorSettings && setEditorSettings(s => ({ ...s, theme: 'nemesis-dark' })) },
    { id: 'theme:tokyo', category: 'Preferences', label: 'Color Theme: Tokyo Night', shortcut: '', action: () => setEditorSettings && setEditorSettings(s => ({ ...s, theme: 'tokyo-night' })) },
    { id: 'settings:open', category: 'Preferences', label: 'Open Settings', shortcut: 'Ctrl+,', action: () => onSelectView('settings') },
    { id: 'about:open', category: 'Help', label: 'About Nemesis IDE', shortcut: '', action: () => onSelectView('about') },
  ], [onNewFile, onNewFolder, onOpenFolder, onSaveFile, onSelectView, onToggleTerminal, onToggleSidebar, onToggleMinimap, onToggleWordWrap, onRunCode, setEditorSettings]);

  const isCommandMode = query.startsWith('>');
  const cleanQuery = isCommandMode ? query.slice(1).trim().toLowerCase() : query.trim().toLowerCase();

  // Filtered items
  const items = React.useMemo(() => {
    if (isCommandMode) {
      if (!cleanQuery) return allCommands;
      return allCommands.filter(c => 
        c.label.toLowerCase().includes(cleanQuery) || 
        c.category.toLowerCase().includes(cleanQuery)
      );
    } else {
      if (!cleanQuery) return allFiles.slice(0, 30);
      return allFiles.filter(f => 
        f.name.toLowerCase().includes(cleanQuery) || 
        f.path.toLowerCase().includes(cleanQuery)
      ).slice(0, 30);
    }
  }, [isCommandMode, cleanQuery, allCommands, allFiles]);

  const handleSelect = (item) => {
    if (!item) return;
    if (isCommandMode) {
      item.action();
    } else {
      onOpenFile(item.path);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        handleSelect(items[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex justify-center pt-10 select-none animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div 
        className="w-[580px] max-w-[90vw] bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl flex flex-col overflow-hidden max-h-[460px] animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-3 py-2 border-b border-[#333333] bg-[#252526]">
          <Search size={16} className="text-[#858585] mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isCommandMode ? 'Ketik perintah untuk dijalankan...' : 'Cari file berdasarkan nama (ketik > untuk perintah)...'}
            className="w-full bg-transparent text-[#cccccc] placeholder-[#6e6e6e] text-xs outline-none"
          />
          <kbd className="text-[10px] bg-[#333333] text-[#8e8e8e] px-1.5 py-0.5 rounded font-mono shrink-0 ml-2">ESC</kbd>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto py-1 max-h-[380px]">
          {items.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-[#858585]">
              {isCommandMode ? 'Tidak ada perintah yang cocok.' : 'Tidak ada file yang cocok dengan pencarian.'}
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={isCommandMode ? item.id : item.path}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-1.5 cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-[#04395e] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                >
                  {isCommandMode ? (
                    <>
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                          isSelected ? 'bg-blue-400/30 text-blue-200' : 'bg-[#333333] text-[#9d9d9d]'
                        }`}>
                          {item.category}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                          isSelected ? 'bg-blue-800 text-blue-100' : 'bg-[#2a2d2e] text-[#858585]'
                        }`}>
                          {item.shortcut}
                        </kbd>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 truncate">
                        <FileIcon filename={item.name} size={15} />
                        <span className="font-medium truncate">{item.name}</span>
                        <span className={`text-[11px] truncate ${isSelected ? 'text-blue-200' : 'text-[#757575]'}`}>
                          {item.path}
                        </span>
                      </div>
                      <ArrowRight size={13} className={`shrink-0 opacity-0 ${isSelected ? 'opacity-100 text-blue-200' : ''}`} />
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
