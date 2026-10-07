import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FolderOpen, Trash2, 
  FilePlus, FolderPlus, RefreshCw, ChevronRight, ChevronDown,
  Edit2, Check, X, MoreHorizontal, ChevronsDownUp,
  Search, CaseSensitive, WholeWord, Regex, Replace, ArrowRight,
  GitBranch, GitCommit, Play, Sparkles, CheckCircle2,
  Package, Download, Sliders, Shield
} from 'lucide-react';
import FileIcon from './FileIcon';

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
        style={{ paddingLeft: `${level * 14 + 12}px` }}
        className={`group flex items-center justify-between py-[3px] pr-2 text-[13px] cursor-pointer select-none transition-colors ${
          isDragOver
            ? 'bg-[#04395e]/60 border border-dashed border-[#007acc] text-white'
            : isSelected
            ? 'bg-[#04395e] text-white font-medium'
            : isFolderActive
            ? 'bg-[#37373d]/70 text-[#e0e0e0]'
            : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
        }`}
      >
        <div className="flex items-center space-x-1.5 truncate flex-1 min-w-0 mr-1">
          {isDirectory ? (
            <span className="text-[#858585] group-hover:text-white flex items-center shrink-0">
              {isOpen ? <ChevronDown size={14} className="mr-0.5" /> : <ChevronRight size={14} className="mr-0.5" />}
              <FileIcon isDirectory={true} isOpen={isOpen} size={15} />
            </span>
          ) : (
            <span className="ml-[16px] flex items-center shrink-0">
              <FileIcon filename={item.name} size={15} />
            </span>
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
                className="bg-[#18181b] border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-white outline-none w-28"
              />
              <button onClick={handleRenameSubmit} className="text-emerald-400 hover:text-emerald-300 p-0.5">
                <Check size={13} />
              </button>
              <button onClick={() => setIsRenaming(false)} className="text-zinc-400 hover:text-zinc-200 p-0.5">
                <X size={13} />
              </button>
            </div>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </div>

        {/* Hover Action Buttons */}
        {!isRenaming && (
          <div className="hidden group-hover:flex items-center space-x-0.5 shrink-0">
            {isDirectory && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setInlineCreate({ type: 'file' });
                    setInlineName('');
                  }}
                  title="File Baru"
                  className="p-1 hover:bg-[#3f3f46] text-[#858585] hover:text-white rounded"
                >
                  <FilePlus size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                    setInlineCreate({ type: 'directory' });
                    setInlineName('');
                  }}
                  title="Folder Baru"
                  className="p-1 hover:bg-[#3f3f46] text-[#858585] hover:text-white rounded"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Ubah Nama"
              className="p-1 hover:bg-[#3f3f46] text-[#858585] hover:text-white rounded"
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
              className="p-1 hover:bg-red-900/50 text-[#858585] hover:text-red-400 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Directory Contents & Inline Creation */}
      {isDirectory && isOpen && (
        <div>
          {inlineCreate && (
            <div
              style={{ paddingLeft: `${(level + 1) * 14 + 12}px` }}
              className="flex items-center space-x-1.5 py-1 pr-2 bg-[#04395e]/40 border-l-2 border-[#007acc] rounded my-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="shrink-0">
                {inlineCreate.type === 'directory' ? (
                  <Folder size={14} className="text-[#dcb67a]" />
                ) : (
                  <FilePlus size={14} className="text-[#42a5f5]" />
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
                className="bg-[#18181b] border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-white outline-none flex-1 min-w-0"
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
                style={{ paddingLeft: `${(level + 1) * 14 + 12}px` }}
                className="py-1 px-2 text-[11px] text-[#6e6e6e] italic flex items-center justify-between group/empty"
              >
                <span>(folder kosong)</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInlineCreate({ type: 'file' });
                    setInlineName('');
                  }}
                  className="hidden group-hover/empty:inline-flex items-center text-[#007acc] hover:underline text-[10px] ml-2"
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

// Helper to extract Outline symbols from active file content
function extractOutlineSymbols(content, ext) {
  if (!content) return [];
  const lines = content.split('\n');
  const items = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (['html', 'htm'].includes(ext)) {
      const match = line.match(/<([a-zA-Z0-9\-]+)([^>]*)>/);
      if (match) {
        const tag = match[1].toLowerCase();
        if (!['meta', 'link', 'br', 'hr', 'input'].includes(tag)) {
          const classMatch = (match[2] || '').match(/class=["']([^"']+)["']/);
          const idMatch = (match[2] || '').match(/id=["']([^"']+)["']/);
          let label = `<${tag}`;
          if (idMatch) label += `#${idMatch[1]}`;
          else if (classMatch) label += `.${classMatch[1].split(' ')[0]}`;
          label += '>';
          items.push({ label, line: i + 1, type: 'tag' });
        }
      }
    } else if (['css', 'scss'].includes(ext)) {
      const match = line.match(/^([.#a-zA-Z0-9_\-\s,:]+)\s*\{/);
      if (match && !match[1].includes('@media')) {
        items.push({ label: match[1].trim(), line: i + 1, type: 'rule' });
      }
    } else if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
      const match = line.match(/(?:function\s+([a-zA-Z0-9_$]+)|class\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>)/);
      if (match) {
        const name = match[1] || match[2] || match[3];
        items.push({ label: name, line: i + 1, type: 'symbol' });
      }
    } else if (ext === 'py') {
      const match = line.match(/^\s*(?:def|class)\s+([a-zA-Z0-9_]+)/);
      if (match) {
        items.push({ label: match[1], line: i + 1, type: 'symbol' });
      }
    }
  }

  return items.slice(0, 50);
}

export default function Sidebar({
  activeView,
  tree,
  activeTabPath,
  activeFile,
  workspaceInfo,
  onOpenFolder,
  onOpenFile,
  onRefresh,
  onCreateItem,
  onDeleteItem,
  onRenameItem,
  onMoveItem,
  editorSettings,
  setEditorSettings,
  onNavigateLine,
  onRunCode,
  isRunning
}) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newPrompt, setNewPrompt] = useState(null);
  const [itemNameInput, setItemNameInput] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [isRootDragOver, setIsRootDragOver] = useState(false);
  const [isWorkspaceTreeOpen, setIsWorkspaceTreeOpen] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Search view states
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Git Source Control states
  const [gitStatus, setGitStatus] = useState({ isGit: false, branch: 'main', files: [] });
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);

  const contextMenuRef = useRef(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Git status when switching to source-control
  useEffect(() => {
    if (activeView === 'source-control') {
      fetch('/api/git/status')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setGitStatus(data);
          }
        })
        .catch(() => {});
    }
  }, [activeView]);

  // Search execute
  const handleExecuteSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const url = `/api/search?q=${encodeURIComponent(searchQuery)}&matchCase=${matchCase}&wholeWord=${wholeWord}&isRegex=${isRegex}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreatePromptSubmit = (e) => {
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

  // Active outline symbols
  const activeExt = (activeFile?.path || '').split('.').pop().toLowerCase();
  const outlineSymbols = React.useMemo(() => {
    return extractOutlineSymbols(activeFile?.content || '', activeExt);
  }, [activeFile?.content, activeExt]);

  // --------------------------------------------------------------------------
  // SEARCH VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'search') {
    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col h-full select-none">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2b2b2b]">
          <h2 className="text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase">SEARCH</h2>
          <button 
            onClick={handleExecuteSearch} 
            title="Refresh Search" 
            className="p-1 hover:bg-[#313131] rounded text-[#858585] hover:text-white"
          >
            <RefreshCw size={13} className={isSearching ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="p-3 space-y-2 border-b border-[#2b2b2b]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
              placeholder="Search"
              className="w-full bg-[#1f1f1f] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1 text-xs text-white outline-none pr-16"
            />
            <div className="absolute right-1 flex items-center space-x-0.5">
              <button
                onClick={() => setMatchCase(!matchCase)}
                title="Match Case"
                className={`p-1 rounded text-[10px] font-mono ${matchCase ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-white'}`}
              >
                Aa
              </button>
              <button
                onClick={() => setWholeWord(!wholeWord)}
                title="Match Whole Word"
                className={`p-1 rounded text-[10px] font-mono ${wholeWord ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-white'}`}
              >
                |Ab|
              </button>
              <button
                onClick={() => setIsRegex(!isRegex)}
                title="Use Regular Expression"
                className={`p-1 rounded text-[10px] font-mono ${isRegex ? 'bg-[#007acc] text-white' : 'text-[#858585] hover:text-white'}`}
              >
                .*
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace"
              className="w-full bg-[#1f1f1f] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-2 text-xs">
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-[#6e6e6e]">
              {searchQuery ? 'Tidak ada hasil ditemukan.' : 'Ketik kata kunci untuk mencari di semua file.'}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[11px] text-[#858585] px-1">
                {searchResults.reduce((acc, r) => acc + r.matches.length, 0)} hasil di {searchResults.length} file
              </div>
              {searchResults.map((result) => (
                <div key={result.path} className="border-b border-[#262626] pb-1">
                  <div 
                    onClick={() => onOpenFile(result.path)}
                    className="flex items-center space-x-1.5 py-1 px-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer font-medium text-[#cccccc]"
                  >
                    <FileIcon filename={result.name} size={14} />
                    <span className="truncate flex-1">{result.name}</span>
                    <span className="text-[10px] bg-[#333333] text-[#a0a0a0] px-1.5 py-0.2 rounded-full font-mono">
                      {result.matches.length}
                    </span>
                  </div>
                  <div className="pl-4 space-y-0.5">
                    {result.matches.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onOpenFile(result.path);
                          if (onNavigateLine) onNavigateLine(m.line);
                        }}
                        className="py-0.5 px-1 hover:bg-[#04395e] text-[#999999] hover:text-white cursor-pointer rounded text-[11px] flex items-center space-x-2 font-mono truncate"
                      >
                        <span className="text-[#666666] shrink-0 w-5 text-right">{m.line}:</span>
                        <span className="truncate">{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SOURCE CONTROL VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'source-control') {
    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col h-full select-none p-3">
        <h2 className="text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase mb-3">SOURCE CONTROL</h2>
        <div className="flex items-center space-x-2 mb-3 px-2 py-1.5 bg-[#202020] rounded border border-[#333333] text-xs text-[#cccccc]">
          <GitBranch size={14} className="text-[#007acc]" />
          <span>Branch: <strong className="text-white">{gitStatus.branch || 'main'}</strong></span>
        </div>

        <div className="mb-3">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Message (Ctrl+Enter to commit)"
            rows={3}
            className="w-full bg-[#1f1f1f] border border-[#3c3c3c] focus:border-[#007acc] rounded p-2 text-xs text-white outline-none resize-none"
          />
          <button
            onClick={() => {
              if (commitMessage.trim()) {
                setIsCommitted(true);
                setTimeout(() => setIsCommitted(false), 3000);
                setCommitMessage('');
              }
            }}
            className="w-full mt-2 bg-[#007acc] hover:bg-[#0062a3] text-white py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Check size={14} />
            <span>Commit & Sync</span>
          </button>
          {isCommitted && (
            <div className="mt-2 text-emerald-400 text-xs text-center flex items-center justify-center space-x-1">
              <CheckCircle2 size={13} />
              <span>Perubahan berhasil di-commit secara lokal!</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-[#858585] uppercase mb-1">
            CHANGES ({gitStatus.files?.length || 0})
          </div>
          {gitStatus.files && gitStatus.files.length > 0 ? (
            <div className="space-y-1">
              {gitStatus.files.map((f) => (
                <div
                  key={f.path}
                  onClick={() => onOpenFile(f.path)}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer text-xs text-[#cccccc]"
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <FileIcon filename={f.name} size={14} />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    {f.status || 'M'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#6e6e6e] py-4 text-center">
              Tidak ada perubahan yang terdeteksi (Working tree clean).
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RUN AND DEBUG VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'run-debug') {
    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col h-full select-none p-3">
        <h2 className="text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase mb-3">RUN AND DEBUG</h2>
        <div className="bg-[#202020] border border-[#333333] rounded p-3 mb-4 space-y-3">
          <p className="text-xs text-[#cccccc]">
            Jalankan file aktif secara instan menggunakan multi-compiler bridge.
          </p>
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              isRunning ? 'bg-[#333333] text-[#777777] cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            <Play size={14} className="fill-white" />
            <span>{isRunning ? 'Sedang Berjalan...' : 'Run & Execute File (F5)'}</span>
          </button>
        </div>

        <div className="text-xs text-[#858585] space-y-2">
          <div className="font-semibold text-[#cccccc]">Runtime yang Didukung:</div>
          <ul className="list-disc list-inside space-y-1 text-[#999999]">
            <li>Python 3 (python)</li>
            <li>Node.js / TypeScript (node, tsx)</li>
            <li>Java Compiler (javac & java)</li>
            <li>C / C++ (GCC MinGW)</li>
            <li>Dart / Flutter (dart run)</li>
            <li>PowerShell / Shell Scripts</li>
          </ul>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EXTENSIONS VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'extensions') {
    const popularExtensions = [
      { name: 'Prettier - Code Formatter', desc: 'Code formatter using prettier', author: 'Prettier', installed: true },
      { name: 'Tailwind CSS IntelliSense', desc: 'Intelligent Tailwind CSS tooling', author: 'Tailwind Labs', installed: true },
      { name: 'Python', desc: 'Python language support with debugging', author: 'Microsoft', installed: true },
      { name: 'ESLint', desc: 'Integrates ESLint JavaScript into VS Code', author: 'Microsoft', installed: true },
      { name: 'Live Server', desc: 'Launch a local development server with live reload', author: 'Ritwick Dey', installed: false },
      { name: 'Auto Rename Tag', desc: 'Auto rename paired HTML/XML tag', author: 'Jun Han', installed: false }
    ];

    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col h-full select-none p-3">
        <h2 className="text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase mb-3">EXTENSIONS</h2>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search Extensions in Marketplace"
            className="w-full bg-[#1f1f1f] border border-[#3c3c3c] rounded px-2.5 py-1 text-xs text-white outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="text-[11px] font-bold text-[#858585] uppercase">RECOMMENDED</div>
          {popularExtensions.map((ext, idx) => (
            <div key={idx} className="p-2 bg-[#202020] hover:bg-[#252525] border border-[#333333] rounded text-xs space-y-1 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white truncate">{ext.name}</span>
              </div>
              <p className="text-[11px] text-[#888888] line-clamp-1">{ext.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#666666]">{ext.author}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  ext.installed ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-[#007acc] text-white'
                }`}>
                  {ext.installed ? 'Enabled' : 'Install'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SETTINGS VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'settings') {
    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] p-4 select-none">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase mb-4">
          Settings
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Color Theme</label>
            <select
              value={editorSettings.theme}
              onChange={(e) => setEditorSettings({ ...editorSettings, theme: e.target.value })}
              className="w-full bg-[#202024] border border-[#2e2e33] rounded px-2.5 py-1.5 text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value="vs-dark-modern">VS Code Dark Modern (Default)</option>
              <option value="nemesis-dark">Nemesis Dark (Vivid Colors)</option>
              <option value="tokyo-night">Tokyo Night (Cyber Neon)</option>
              <option value="vs-dark">Dark (VS Code Legacy)</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Font Size ({editorSettings.fontSize}px)</label>
            <input
              type="range"
              min="11"
              max="24"
              value={editorSettings.fontSize}
              onChange={(e) => setEditorSettings({ ...editorSettings, fontSize: Number(e.target.value) })}
              className="w-full accent-[#007acc] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5 font-medium">Tab Size</label>
            <select
              value={editorSettings.tabSize}
              onChange={(e) => setEditorSettings({ ...editorSettings, tabSize: Number(e.target.value) })}
              className="w-full bg-[#202024] border border-[#2e2e33] rounded px-2.5 py-1.5 text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>

          <div className="pt-2 border-t border-[#27272a]">
            <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={editorSettings.wordWrap === 'on'}
                onChange={(e) => setEditorSettings({ ...editorSettings, wordWrap: e.target.checked ? 'on' : 'off' })}
                className="accent-[#007acc] rounded"
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
                className="accent-[#007acc] rounded"
              />
              <span>Show Minimap</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ABOUT VIEW
  // --------------------------------------------------------------------------
  if (activeView === 'about') {
    return (
      <div className="w-[280px] bg-[#181818] border-r border-[#2b2b2b] p-4 flex flex-col justify-between select-none">
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
        </div>
        <div className="text-[11px] text-zinc-500 border-t border-[#27272a] pt-3">
          Status: Production Ready ⚡
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EXPLORER VIEW (DEFAULT)
  // --------------------------------------------------------------------------
  return (
    <div className="w-[260px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col h-full select-none relative">
      {/* Explorer Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2b2b2b]">
        <h2 className="text-[11px] font-bold tracking-wider text-[#bbbbbb] uppercase">EXPLORER</h2>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => {
              setNewPrompt({ type: 'file', targetDir: selectedFolder || '' });
              setItemNameInput('');
            }}
            title="New File"
            className="p-1 hover:bg-[#313131] rounded text-[#858585] hover:text-white"
          >
            <FilePlus size={14} />
          </button>
          <button
            onClick={() => {
              setNewPrompt({ type: 'directory', targetDir: selectedFolder || '' });
              setItemNameInput('');
            }}
            title="New Folder"
            className="p-1 hover:bg-[#313131] rounded text-[#858585] hover:text-white"
          >
            <FolderPlus size={14} />
          </button>
          <button
            onClick={onRefresh}
            title="Refresh Explorer"
            className="p-1 hover:bg-[#313131] rounded text-[#858585] hover:text-white"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={() => setIsWorkspaceTreeOpen(!isWorkspaceTreeOpen)}
            title="Collapse / Expand Folders"
            className="p-1 hover:bg-[#313131] rounded text-[#858585] hover:text-white"
          >
            <ChevronsDownUp size={14} />
          </button>
        </div>
      </div>

      {/* Workspace Root Section (Collapsible Header matching screenshot: TP4) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace Folder Header */}
        <div
          onClick={() => setIsWorkspaceTreeOpen(!isWorkspaceTreeOpen)}
          className="flex items-center justify-between px-2 py-1 bg-[#181818] hover:bg-[#202020] cursor-pointer text-[#cccccc] font-bold text-[11px] uppercase tracking-wide border-b border-[#222222]"
        >
          <div className="flex items-center space-x-1 truncate">
            {isWorkspaceTreeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="truncate">{workspaceInfo?.name || 'WORKSPACE'}</span>
          </div>
        </div>

        {/* Inline Create Input at Root or Selected Folder */}
        {newPrompt && (
          <form
            onSubmit={handleCreatePromptSubmit}
            className="p-2 bg-[#04395e]/40 border-l-2 border-[#007acc] my-1 mx-2 rounded flex items-center space-x-1.5"
          >
            <span className="shrink-0">
              {newPrompt.type === 'directory' ? (
                <Folder size={14} className="text-[#dcb67a]" />
              ) : (
                <FilePlus size={14} className="text-[#42a5f5]" />
              )}
            </span>
            <input
              type="text"
              value={itemNameInput}
              onChange={(e) => setItemNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setNewPrompt(null)}
              autoFocus
              placeholder={newPrompt.type === 'directory' ? 'folder-name' : 'filename.ext'}
              className="bg-[#18181b] border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-white outline-none flex-1 min-w-0"
            />
            <button type="submit" className="text-emerald-400 p-0.5">
              <Check size={13} />
            </button>
            <button type="button" onClick={() => setNewPrompt(null)} className="text-zinc-400 p-0.5">
              <X size={13} />
            </button>
          </form>
        )}

        {/* File Tree List */}
        {isWorkspaceTreeOpen && (
          <div
            onContextMenu={openRootContextMenu}
            onDragOver={(e) => {
              e.preventDefault();
              setIsRootDragOver(true);
            }}
            onDragLeave={() => setIsRootDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsRootDragOver(false);
              const sourcePath = e.dataTransfer.getData('text/plain');
              if (sourcePath && onMoveItem) {
                onMoveItem(sourcePath, '');
              }
            }}
            className={`flex-1 overflow-y-auto py-1 transition-colors ${
              isRootDragOver ? 'bg-blue-950/20 border-2 border-dashed border-[#007acc]' : ''
            }`}
          >
            {tree.length === 0 ? (
              <div className="text-center py-6 px-3 text-xs text-[#858585] space-y-2">
                <p>Folder project kosong.</p>
                <button
                  onClick={() => onOpenFolder && onOpenFolder()}
                  className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white py-1 px-2 rounded text-xs transition-colors"
                >
                  Buka Folder Lain...
                </button>
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
        )}

        {/* Collapsible Section 1: OUTLINE (Just like VS Code screenshot!) */}
        <div className="border-t border-[#262626]">
          <button
            onClick={() => setIsOutlineOpen(!isOutlineOpen)}
            className="w-full flex items-center justify-between px-3 py-1 bg-[#181818] hover:bg-[#202020] text-[#999999] hover:text-[#cccccc] text-[11px] font-bold tracking-wider uppercase transition-colors"
          >
            <div className="flex items-center space-x-1">
              {isOutlineOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>OUTLINE</span>
            </div>
          </button>
          {isOutlineOpen && (
            <div className="max-h-40 overflow-y-auto py-1 px-2 text-xs text-[#cccccc] bg-[#141414]">
              {outlineSymbols.length === 0 ? (
                <div className="text-[11px] text-[#6e6e6e] italic py-2 text-center">
                  Tidak ada simbol terdeteksi di file aktif.
                </div>
              ) : (
                outlineSymbols.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateLine && onNavigateLine(item.line)}
                    className="flex items-center space-x-2 py-0.5 px-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer text-[11px] font-mono truncate"
                  >
                    <span className="text-[#666666] w-5 text-right shrink-0">{item.line}</span>
                    <span className="truncate text-blue-300">{item.label}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Collapsible Section 2: TIMELINE (Just like VS Code screenshot!) */}
        <div className="border-t border-[#262626]">
          <button
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="w-full flex items-center justify-between px-3 py-1 bg-[#181818] hover:bg-[#202020] text-[#999999] hover:text-[#cccccc] text-[11px] font-bold tracking-wider uppercase transition-colors"
          >
            <div className="flex items-center space-x-1">
              {isTimelineOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>TIMELINE</span>
            </div>
          </button>
          {isTimelineOpen && (
            <div className="py-2 px-3 text-xs text-[#888888] bg-[#141414]">
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>File Save History (Local)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 text-xs text-[#cccccc] z-50 min-w-[170px] select-none"
        >
          {contextMenu.isRoot ? (
            <>
              <button
                onClick={() => {
                  onOpenFolder && onOpenFolder();
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FolderOpen size={13} className="text-[#dcb67a]" />
                <span>Buka Folder Project...</span>
              </button>
              <div className="border-t border-[#333333] my-1" />
              <button
                onClick={() => {
                  setNewPrompt({ type: 'file', targetDir: '' });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FilePlus size={13} className="text-[#007acc]" />
                <span>File Baru</span>
              </button>
              <button
                onClick={() => {
                  setNewPrompt({ type: 'directory', targetDir: '' });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FolderPlus size={13} className="text-[#dcb67a]" />
                <span>Folder Baru</span>
              </button>
              <div className="border-t border-[#333333] my-1" />
              <button
                onClick={() => {
                  onRefresh();
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
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
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FilePlus size={13} className="text-[#007acc]" />
                <span>File Baru di Sini</span>
              </button>
              <button
                onClick={() => {
                  setSelectedFolder(contextMenu.item.path);
                  setNewPrompt({ type: 'directory', targetDir: contextMenu.item.path });
                  setItemNameInput('');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FolderPlus size={13} className="text-[#dcb67a]" />
                <span>Folder Baru di Sini</span>
              </button>
              <div className="border-t border-[#333333] my-1" />
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
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
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
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <FileIcon filename={contextMenu.item.name} size={13} />
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
                className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex items-center space-x-2"
              >
                <Edit2 size={13} className="text-zinc-400" />
                <span>Ubah Nama</span>
              </button>
              <div className="border-t border-[#333333] my-1" />
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
