import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, Trash2, 
  FilePlus, FolderPlus, RefreshCw, ChevronRight, ChevronDown,
  Edit2, Check, X, Terminal, Coffee, Sparkles, Layers,
  CornerDownRight
} from 'lucide-react';
import { getFileBadgeColor } from '../utils/languageHelper';

function FileTreeItem({ 
  item, 
  level = 0, 
  activeTabPath, 
  selectedFolder,
  onSelectFolder,
  onOpenFile, 
  onDelete, 
  onRename,
  onCreate,
  onMove,
  onContextMenu
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [inlineCreate, setInlineCreate] = useState(null); // { type: 'file' | 'directory' }
  const [inlineName, setInlineName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const isDirectory = item.type === 'directory';
  const isSelected = activeTabPath === item.path;
  const isFolderActive = selectedFolder === item.path;

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

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inlineName.trim()) return;
    const targetPath = `${item.path}/${inlineName.trim()}`;
    onCreate(targetPath, inlineCreate.type);
    setInlineCreate(null);
    setInlineName('');
  };

  const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    const badgeColor = getFileBadgeColor(filePath).split(' ')[0] || 'text-zinc-400';

    if (ext === 'java') return <Coffee size={15} className="text-orange-500 shrink-0" />;
    if (ext === 'dart') return <Sparkles size={15} className="text-cyan-400 shrink-0" />;
    if (ext === 'sh' || ext === 'ps1' || ext === 'bat' || ext === 'cmd') {
      return <Terminal size={15} className="text-lime-400 shrink-0" />;
    }
    if (ext === 'md' || ext === 'txt') return <FileText size={15} className="text-teal-300 shrink-0" />;
    return <FileCode size={15} className={`${badgeColor} shrink-0`} />;
  };

  return (
    <div>
      <div
        draggable={!isRenaming}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData('text/plain', item.path);
        }}
        onDragOver={(e) => {
          if (isDirectory) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
          }
        }}
        onDragLeave={(e) => {
          if (isDirectory) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          if (isDirectory) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            const sourcePath = e.dataTransfer.getData('text/plain');
            if (sourcePath && sourcePath !== item.path) {
              onMove(sourcePath, item.path);
            }
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e, item);
        }}
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
            onSelectFolder(isFolderActive ? null : item.path);
          } else {
            onOpenFile(item.path);
          }
        }}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 text-sm cursor-pointer rounded transition-all ${
          isDragOver
            ? 'bg-blue-600/30 border border-dashed border-blue-400 text-blue-200'
            : isSelected
            ? 'bg-blue-600/20 text-blue-200 border-l-2 border-blue-500'
            : isFolderActive
            ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-400'
            : 'text-zinc-300 hover:bg-[#27272a]/70 hover:text-white'
        }`}
      >
        <div className="flex items-center space-x-2 truncate flex-1 min-w-0 mr-1">
          {isDirectory ? (
            <span className="text-zinc-400 flex items-center shrink-0">
              {isOpen ? <ChevronDown size={14} className="mr-0.5" /> : <ChevronRight size={14} className="mr-0.5" />}
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
              <button onClick={handleRenameSubmit} className="text-emerald-400 hover:text-emerald-300 p-0.5">
                <Check size={13} />
              </button>
              <button onClick={() => setIsRenaming(false)} className="text-zinc-400 hover:text-zinc-200 p-0.5">
                <X size={13} />
              </button>
            </div>
          ) : (
            <span className="truncate text-xs select-none">{item.name}</span>
          )}
        </div>

        {/* Hover Action Buttons */}
        {!isRenaming && (
          <div className="hidden group-hover:flex items-center space-x-1 opacity-90">
            {isDirectory && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setInlineCreate({ type: 'file' });
                    setInlineName('');
                  }}
                  title={`File Baru di /${item.name}`}
                  className="p-1 hover:bg-[#3f3f46] text-zinc-400 hover:text-white rounded"
                >
                  <FilePlus size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setInlineCreate({ type: 'directory' });
                    setInlineName('');
                  }}
                  title={`Folder Baru di /${item.name}`}
                  className="p-1 hover:bg-[#3f3f46] text-zinc-400 hover:text-white rounded"
                >
                  <FolderPlus size={13} />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Ubah Nama"
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
              title="Hapus"
              className="p-1 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Directory Contents & Inline Creation */}
      {isDirectory && isOpen && (
        <div>
          {/* Inline input directly inside this folder */}
          {inlineCreate && (
            <div
              style={{ paddingLeft: `${(level + 1) * 12 + 10}px` }}
              className="flex items-center space-x-1.5 py-1 pr-2 bg-blue-950/40 border-l-2 border-blue-500 rounded my-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-zinc-400 shrink-0">
                {inlineCreate.type === 'directory' ? (
                  <Folder size={14} className="text-amber-400" />
                ) : (
                  <FileCode size={14} className="text-blue-400" />
                )}
              </span>
              <input
                type="text"
                value={inlineName}
                onChange={(e) => setInlineName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInlineSubmit(e);
                  if (e.key === 'Escape') setInlineCreate(null);
                }}
                autoFocus
                placeholder={inlineCreate.type === 'directory' ? 'nama-folder' : 'nama-file.ext'}
                className="bg-[#18181b] border border-blue-500/80 rounded px-1.5 py-0.5 text-xs text-white outline-none flex-1 min-w-0"
              />
              <button
                onClick={handleInlineSubmit}
                title="Konfirmasi"
                className="text-emerald-400 hover:text-emerald-300 p-0.5"
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => setInlineCreate(null)}
                title="Batal"
                className="text-zinc-400 hover:text-zinc-200 p-0.5"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Children items */}
          {item.children && item.children.length > 0 ? (
            item.children.map((child) => (
              <FileTreeItem
                key={child.path}
                item={child}
                level={level + 1}
                activeTabPath={activeTabPath}
                selectedFolder={selectedFolder}
                onSelectFolder={onSelectFolder}
                onOpenFile={onOpenFile}
                onDelete={onDelete}
                onRename={onRename}
                onCreate={onCreate}
                onMove={onMove}
                onContextMenu={onContextMenu}
              />
            ))
          ) : (
            !inlineCreate && (
              <div
                style={{ paddingLeft: `${(level + 1) * 12 + 10}px` }}
                className="py-1 px-2 text-[11px] text-zinc-500 italic flex items-center justify-between group/empty"
              >
                <span>(folder kosong)</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInlineCreate({ type: 'file' });
                    setInlineName('');
                  }}
                  className="hidden group-hover/empty:inline-flex items-center text-blue-400 hover:text-blue-300 text-[10px] ml-2"
                >
                  + buat file
                </button>
              </div>
            )
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
  onMoveItem,
  editorSettings,
  setEditorSettings
}) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newPrompt, setNewPrompt] = useState(null); // { type: 'file' | 'directory', targetDir: string }
  const [itemNameInput, setItemNameInput] = useState('');
  const [contextMenu, setContextMenu] = useState(null); // { x, y, item, isRoot }
  const [isRootDragOver, setIsRootDragOver] = useState(false);
  const contextMenuRef = useRef(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      window.addEventListener('click', handleOutsideClick);
      window.addEventListener('contextmenu', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [contextMenu]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!itemNameInput.trim() || !newPrompt) return;
    const cleanInput = itemNameInput.trim().replace(/^[\/\\]+/, '');
    const fullPath = newPrompt.targetDir ? `${newPrompt.targetDir}/${cleanInput}` : cleanInput;
    onCreateItem(fullPath, newPrompt.type);
    setNewPrompt(null);
    setItemNameInput('');
  };

  const openContextMenu = (e, item) => {
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 200),
      item,
      isRoot: false
    });
  };

  const openRootContextMenu = (e) => {
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 150),
      item: null,
      isRoot: true
    });
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
              <li><strong className="text-zinc-200">Runtime:</strong> GCC MinGW, Python, Node.js, Java, Dart, PowerShell</li>
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
    <div className="w-64 bg-[#18181b] border-r border-[#27272a] flex flex-col h-full select-none relative">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#27272a]">
        {selectedFolder ? (
          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">LOKASI:</span>
            <div 
              className="flex items-center space-x-1 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] px-1.5 py-0.5 rounded truncate max-w-[105px]" 
              title={`Target Folder: /${selectedFolder} (Klik 'x' untuk batal)`}
            >
              <Folder size={11} className="text-amber-400 shrink-0" />
              <span className="truncate">{selectedFolder.split('/').pop()}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedFolder(null); }} 
                className="hover:text-white ml-0.5"
                title="Batal pilih folder (kembali ke root)"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ) : (
          <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 truncate">
            WORKSPACE
          </span>
        )}

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setNewPrompt({ type: 'file', targetDir: selectedFolder || '' });
              setItemNameInput('');
            }}
            title={selectedFolder ? `File Baru di /${selectedFolder}` : 'File Baru di Root'}
            className="p-1 hover:bg-[#27272a] text-zinc-400 hover:text-white rounded"
          >
            <FilePlus size={15} />
          </button>
          <button
            onClick={() => {
              setNewPrompt({ type: 'directory', targetDir: selectedFolder || '' });
              setItemNameInput('');
            }}
            title={selectedFolder ? `Folder Baru di /${selectedFolder}` : 'Folder Baru di Root'}
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
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-zinc-300 font-medium truncate">
              Buat {newPrompt.type === 'directory' ? 'Folder' : 'File'} di: <span className="text-blue-400 font-mono">{newPrompt.targetDir ? `/${newPrompt.targetDir}` : 'Root'}</span>
            </span>
            <button
              type="button"
              onClick={() => setNewPrompt(null)}
              className="text-zinc-500 hover:text-zinc-300 ml-1"
            >
              <X size={12} />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              placeholder={newPrompt.type === 'directory' ? 'components atau sub/folder' : 'index.js atau sub/index.js'}
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
      <div 
        onContextMenu={openRootContextMenu}
        onDragOver={(e) => {
          e.preventDefault();
          setIsRootDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsRootDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsRootDragOver(false);
          const sourcePath = e.dataTransfer.getData('text/plain');
          if (sourcePath && onMoveItem) {
            onMoveItem(sourcePath, '');
          }
        }}
        className={`flex-1 overflow-y-auto py-2 px-1 transition-colors ${
          isRootDragOver ? 'bg-blue-950/20 border-2 border-dashed border-blue-500/50' : ''
        }`}
      >
        {tree.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 px-3">
            Workspace kosong. Gunakan tombol + di atas untuk membuat file atau folder baru!
          </div>
        ) : (
          tree.map((item) => (
            <FileTreeItem
              key={item.path}
              item={item}
              level={0}
              activeTabPath={activeTabPath}
              selectedFolder={selectedFolder}
              onSelectFolder={setSelectedFolder}
              onOpenFile={onOpenFile}
              onDelete={onDeleteItem}
              onRename={onRenameItem}
              onCreate={onCreateItem}
              onMove={onMoveItem}
              onContextMenu={openContextMenu}
            />
          ))
        )}
      </div>

      {/* Floating Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed bg-[#202024] border border-[#2e2e33] rounded-md shadow-2xl py-1 text-xs text-zinc-200 z-50 min-w-[160px] select-none"
        >
          {contextMenu.isRoot ? (
            <>
              <button
                onClick={() => {
                  setNewPrompt({ type: 'file', targetDir: '' });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <FilePlus size={13} className="text-blue-400" />
                <span>File Baru</span>
              </button>
              <button
                onClick={() => {
                  setNewPrompt({ type: 'directory', targetDir: '' });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <FolderPlus size={13} className="text-amber-400" />
                <span>Folder Baru</span>
              </button>
              <div className="border-t border-[#2e2e33] my-1" />
              <button
                onClick={() => {
                  onRefresh();
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <RefreshCw size={13} className="text-zinc-400" />
                <span>Refresh</span>
              </button>
            </>
          ) : contextMenu.item.type === 'directory' ? (
            <>
              <button
                onClick={() => {
                  setSelectedFolder(contextMenu.item.path);
                  setNewPrompt({ type: 'file', targetDir: contextMenu.item.path });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <FilePlus size={13} className="text-blue-400" />
                <span>File Baru di Sini</span>
              </button>
              <button
                onClick={() => {
                  setSelectedFolder(contextMenu.item.path);
                  setNewPrompt({ type: 'directory', targetDir: contextMenu.item.path });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <FolderPlus size={13} className="text-amber-400" />
                <span>Folder Baru di Sini</span>
              </button>
              <div className="border-t border-[#2e2e33] my-1" />
              <button
                onClick={() => {
                  const newName = prompt('Nama baru:', contextMenu.item.name);
                  if (newName && newName !== contextMenu.item.name) {
                    const parts = contextMenu.item.path.split('/');
                    parts.pop();
                    const parentDir = parts.join('/');
                    const newPath = parentDir ? `${parentDir}/${newName}` : newName;
                    onRenameItem(contextMenu.item.path, newPath);
                  }
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <Edit2 size={13} className="text-zinc-400" />
                <span>Ubah Nama</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus folder ${contextMenu.item.name}?`)) {
                    onDeleteItem(contextMenu.item.path);
                  }
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white flex items-center space-x-2 text-red-400"
              >
                <Trash2 size={13} />
                <span>Hapus Folder</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onOpenFile(contextMenu.item.path);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <FileCode size={13} className="text-blue-400" />
                <span>Buka File</span>
              </button>
              <button
                onClick={() => {
                  const newName = prompt('Nama baru:', contextMenu.item.name);
                  if (newName && newName !== contextMenu.item.name) {
                    const parts = contextMenu.item.path.split('/');
                    parts.pop();
                    const parentDir = parts.join('/');
                    const newPath = parentDir ? `${parentDir}/${newName}` : newName;
                    onRenameItem(contextMenu.item.path, newPath);
                  }
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
              >
                <Edit2 size={13} className="text-zinc-400" />
                <span>Ubah Nama</span>
              </button>
              <div className="border-t border-[#2e2e33] my-1" />
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus file ${contextMenu.item.name}?`)) {
                    onDeleteItem(contextMenu.item.path);
                  }
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white flex items-center space-x-2 text-red-400"
              >
                <Trash2 size={13} />
                <span>Hapus File</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
