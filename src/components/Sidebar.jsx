import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, Trash2, 
  FilePlus, FolderPlus, RefreshCw, ChevronRight, ChevronDown,
  Edit2, Check, X, Terminal, Coffee, Sparkles, Layers
} from 'lucide-react';
import { getFileBadgeColor, getLanguageFromPath, getLanguageName } from '../utils/languageHelper';

function FileTreeItem({ 
  item, 
  level = 0, 
  activeTabPath, 
  onOpenFile, 
  onDelete, 
  onRename 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const isDirectory = item.type === 'directory';
  const isSelected = activeTabPath === item.path;

  const handleRenameSubmit = (e) => {
    e.stopPropagation();
    if (newName && newName !== item.name) {
      const parts = item.path.split('/');
      parts.pop();
      const parentDir = parts.join('/');
      const newPath = parentDir ? `${parentDir}/${newName}` : newName;
      onRename(item.path, newPath);
    }
    setIsRenaming(false);
  };

  const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    const badgeColor = getFileBadgeColor(filePath).split(' ')[0] || 'text-zinc-400';

    if (ext === 'java') return <Coffee size={15} className="text-orange-500" />;
    if (ext === 'dart') return <Sparkles size={15} className="text-cyan-400" />;
    if (ext === 'sh' || ext === 'ps1' || ext === 'bat' || ext === 'cmd') {
      return <Terminal size={15} className="text-lime-400" />;
    }
    if (ext === 'md' || ext === 'txt') return <FileText size={15} className="text-teal-300" />;
    return <FileCode size={15} className={badgeColor} />;
  };

  return (
    <div>
      <div
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
          } else {
            onOpenFile(item.path);
          }
        }}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 text-sm cursor-pointer rounded transition-colors ${
          isSelected
            ? 'bg-blue-600/20 text-blue-200 border-l-2 border-blue-500'
            : 'text-zinc-300 hover:bg-[#27272a]/70 hover:text-white'
        }`}
      >
        <div className="flex items-center space-x-2 truncate flex-1 min-w-0 mr-1">
          {isDirectory ? (
            <span className="text-zinc-400 flex items-center">
              {isOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
              {isOpen ? <FolderOpen size={15} className="text-amber-400" /> : <Folder size={15} className="text-amber-400" />}
            </span>
          ) : (
            getFileIcon(item.path)
          )}

          {isRenaming ? (
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(e);
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
                autoFocus
                className="bg-[#18181b] border border-blue-500 rounded px-1.5 py-0.5 text-xs text-white outline-none w-28"
              />
              <button onClick={handleRenameSubmit} className="text-emerald-400 hover:text-emerald-300">
                <Check size={13} />
              </button>
              <button onClick={() => setIsRenaming(false)} className="text-zinc-400 hover:text-zinc-200">
                <X size={13} />
              </button>
            </div>
          ) : (
            <span className="truncate text-xs select-none">{item.name}</span>
          )}
        </div>

        {/* Hover Action Buttons */}
        {!isRenaming && (
          <div className="hidden group-hover:flex items-center space-x-1 opacity-80">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Rename"
              className="p-1 hover:bg-[#3f3f46] text-zinc-400 hover:text-white rounded"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Yakin ingin menghapus ${item.name}?`)) {
                  onDelete(item.path);
                }
              }}
              title="Delete"
              className="p-1 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {isDirectory && isOpen && item.children && (
        <div>
          {item.children.length === 0 ? (
            <div
              style={{ paddingLeft: `${(level + 1) * 12 + 10}px` }}
              className="py-1 text-[11px] text-zinc-500 italic"
            >
              (folder kosong)
            </div>
          ) : (
            item.children.map((child) => (
              <FileTreeItem
                key={child.path}
                item={child}
                level={level + 1}
                activeTabPath={activeTabPath}
                onOpenFile={onOpenFile}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  activeView,
  tree,
  activeTabPath,
  onOpenFile,
  onRefresh,
  onCreateItem,
  onDeleteItem,
  onRenameItem,
  editorSettings,
  setEditorSettings
}) {
  const [newPrompt, setNewPrompt] = useState(null);
  const [itemNameInput, setItemNameInput] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!itemNameInput.trim()) return;
    onCreateItem(itemNameInput.trim(), newPrompt.type);
    setNewPrompt(null);
    setItemNameInput('');
  };

  if (activeView === 'about') {
    return (
      <div className="w-64 bg-[#18181b] border-r border-[#27272a] p-4 flex flex-col justify-between select-none">
        <div>
          <div className="flex items-center space-x-2.5 mb-4 p-2.5 rounded-lg bg-[#202024] border border-[#2e2e33]">
            <img src="/emblem.png" alt="Nemesis Logo" className="w-9 h-9 rounded-md object-cover border border-purple-500/40 bg-[#040b1b]" />
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Nemesis IDE</h2>
              <span className="text-[10px] text-blue-400 font-mono">v0.1.0 Desktop</span>
            </div>
          </div>
          <div className="bg-[#202024] p-3 rounded-lg border border-[#2e2e33] text-xs text-zinc-300 space-y-2 mb-4">
            <p className="font-semibold text-blue-400">Arsitektur Nemesis IDE:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong className="text-zinc-200">Editor:</strong> Monaco Engine (Multi-Language Highlight)</li>
              <li><strong className="text-zinc-200">Frontend:</strong> React + Vite + Tailwind CSS</li>
              <li><strong className="text-zinc-200">Backend:</strong> Node.js Express (File System & Process Runner)</li>
              <li><strong className="text-zinc-200">Runtime:</strong> Python, Node.js, Java, Dart, Bash, PowerShell</li>
            </ul>
          </div>
          <div className="text-xs text-zinc-400 leading-relaxed">
            Dukung 80+ bahasa pemrograman dengan live streaming runner di panel terminal!
          </div>
        </div>
        <div className="text-[11px] text-zinc-500 border-t border-[#27272a] pt-3">
          Status: Production Ready ⚡
        </div>
      </div>
    );
  }

  if (activeView === 'settings') {
    return (
      <div className="w-64 bg-[#18181b] border-r border-[#27272a] p-4 select-none">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase mb-4">
          Pengaturan Editor
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Tema Warna Sintaks</label>
            <select
              value={editorSettings.theme}
              onChange={(e) => setEditorSettings({ ...editorSettings, theme: e.target.value })}
              className="w-full bg-[#202024] border border-[#2e2e33] rounded px-2.5 py-1.5 text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value="nemesis-dark">Nemesis Dark (Vivid Colors)</option>
              <option value="tokyo-night">Tokyo Night (Cyber Neon)</option>
              <option value="vs-dark">Dark (VS Code Default)</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Ukuran Font ({editorSettings.fontSize}px)</label>
            <input
              type="range"
              min="11"
              max="24"
              value={editorSettings.fontSize}
              onChange={(e) => setEditorSettings({ ...editorSettings, fontSize: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Tab Size</label>
            <select
              value={editorSettings.tabSize}
              onChange={(e) => setEditorSettings({ ...editorSettings, tabSize: Number(e.target.value) })}
              className="w-full bg-[#202024] border border-[#2e2e33] rounded px-2.5 py-1.5 text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value={2}>2 Spasi</option>
              <option value={4}>4 Spasi</option>
            </select>
          </div>

          <div className="pt-2 border-t border-[#27272a]">
            <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={editorSettings.wordWrap === 'on'}
                onChange={(e) => setEditorSettings({ ...editorSettings, wordWrap: e.target.checked ? 'on' : 'off' })}
                className="accent-blue-500 rounded"
              />
              <span>Word Wrap</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={editorSettings.minimap}
                onChange={(e) => setEditorSettings({ ...editorSettings, minimap: e.target.checked })}
                className="accent-blue-500 rounded"
              />
              <span>Tampilkan Minimap</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#18181b] border-r border-[#27272a] flex flex-col h-full select-none">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#27272a]">
        <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 truncate">
          WORKSPACE
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setNewPrompt({ type: 'file' });
              setItemNameInput('');
            }}
            title="File Baru"
            className="p-1 hover:bg-[#27272a] text-zinc-400 hover:text-white rounded"
          >
            <FilePlus size={15} />
          </button>
          <button
            onClick={() => {
              setNewPrompt({ type: 'directory' });
              setItemNameInput('');
            }}
            title="Folder Baru"
            className="p-1 hover:bg-[#27272a] text-zinc-400 hover:text-white rounded"
          >
            <FolderPlus size={15} />
          </button>
          <button
            onClick={onRefresh}
            title="Refresh File Tree"
            className="p-1 hover:bg-[#27272a] text-zinc-400 hover:text-white rounded"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Input Modal for New File / Folder */}
      {newPrompt && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-[#27272a] bg-[#202024]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-zinc-400 font-medium">
              Nama {newPrompt.type === 'directory' ? 'Folder' : 'File'} Baru:
            </span>
            <button
              type="button"
              onClick={() => setNewPrompt(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X size={12} />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              placeholder={newPrompt.type === 'directory' ? 'src' : 'App.java'}
              value={itemNameInput}
              onChange={(e) => setItemNameInput(e.target.value)}
              className="flex-1 bg-[#18181b] border border-blue-500/70 rounded px-2 py-1 text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Buat
            </button>
          </div>
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {tree.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500">
            Workspace kosong. Buat file baru untuk memulai!
          </div>
        ) : (
          tree.map((item) => (
            <FileTreeItem
              key={item.path}
              item={item}
              level={0}
              activeTabPath={activeTabPath}
              onOpenFile={onOpenFile}
              onDelete={onDeleteItem}
              onRename={onRenameItem}
            />
          ))
        )}
      </div>
    </div>
  );
}
