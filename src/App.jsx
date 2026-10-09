import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Folder } from 'lucide-react';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import { getTheme } from './utils/themeHelper';

export default function App() {
  const [activeView, setActiveView] = useState('explorer');
  const [tree, setTree] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTabPath, setActiveTabPath] = useState(null);
  
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState('connected');
  const [saveStatus, setSaveStatus] = useState('');
  
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [workspaceInfo, setWorkspaceInfo] = useState({ path: '', name: 'Workspace' });
  const [editorSettings, setEditorSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nemesis_editor_settings');
      if (saved) return { autoSave: true, formatOnSave: true, ...JSON.parse(saved) };
    } catch (e) {}
    return {
      theme: 'nemesis-dark',
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on',
      minimap: true,
      formatOnSave: true,
      autoSave: true
    };
  });

  // Persist editor settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nemesis_editor_settings', JSON.stringify(editorSettings));
    } catch (e) {}
  }, [editorSettings]);

  // Synchronize native window controls (minimize/maximize/close) in Electron
  useEffect(() => {
    if (window.electronAPI && typeof window.electronAPI.setTitleBarOverlay === 'function') {
      const currentTheme = getTheme(editorSettings.theme);
      window.electronAPI.setTitleBarOverlay(currentTheme.titleBarOverlay);
    }
  }, [editorSettings.theme]);

  // Fetch current workspace info
  const fetchWorkspaceInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/workspace');
      const data = await res.json();
      if (data.success) {
        setWorkspaceInfo({ path: data.path, name: data.name });
        document.title = data.name ? `${data.name} - Nemesis IDE` : 'Nemesis IDE';
      }
    } catch (e) {
      console.warn('Failed to fetch workspace info:', e);
    }
  }, []);

  // Fetch workspace file tree
  const fetchTree = useCallback(async () => {
    try {
      const res = await fetch('/api/tree');
      const data = await res.json();
      if (data.success) {
        setTree(data.tree);
        setServerStatus('connected');
        return data.tree;
      }
    } catch (err) {
      console.error('Failed to load file tree:', err);
      setServerStatus('disconnected');
    }
  }, []);

  // Open folder action (Electron native dialog, PowerShell fallback, or explicit path)
  const handleOpenFolder = async (explicitPath = null) => {
    try {
      let targetPath = explicitPath;

      if (!targetPath) {
        if (window.electronAPI && typeof window.electronAPI.openFolderDialog === 'function') {
          targetPath = await window.electronAPI.openFolderDialog();
        } else {
          // Web / browser fallback: call server pick endpoint
          const pickRes = await fetch('/api/workspace/pick', { method: 'POST' });
          const pickData = await pickRes.json();
          if (pickData.success) {
            targetPath = pickData.path;
          }
        }
      }

      if (!targetPath) return; // User canceled

      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir: targetPath })
      });
      const data = await res.json();

      if (data.success) {
        setWorkspaceInfo({ path: data.path, name: data.name });
        document.title = `${data.name} - Nemesis IDE`;
        setTabs([]);
        setActiveTabPath(null);
        await fetchTree();
        setTerminalOutput((prev) => prev + `\n> [Nemesis IDE] Membuka project folder: ${data.name} (${data.path})\n`);
      } else {
        alert(data.error || 'Gagal membuka folder project.');
      }
    } catch (err) {
      console.error('Error opening folder:', err);
      alert('Terjadi kesalahan saat membuka folder project.');
    }
  };

  // Open a file into a tab
  const handleOpenFile = async (filePath) => {
    const existingTab = tabs.find((t) => t.path === filePath);
    if (existingTab) {
      setActiveTabPath(filePath);
      return;
    }

    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        const newTab = {
          path: data.path,
          name: data.name,
          content: data.content,
          originalContent: data.content,
          isDirty: false
        };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabPath(filePath);
      } else {
        alert(`Gagal membuka file: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to read file:', err);
      alert('Gagal menghubungi backend IDE.');
    }
  };

  // Initial load: fetch workspace and file tree
  useEffect(() => {
    fetchWorkspaceInfo();
    fetchTree().then((initialTree) => {
      if (initialTree && initialTree.length > 0) {
        const firstFile = initialTree.find((i) => i.type === 'file') || (initialTree[0].children && initialTree[0].children[0]);
        if (firstFile) {
          handleOpenFile(firstFile.path);
        }
      }
    });
  }, [fetchTree, fetchWorkspaceInfo]);

  // Always keep latest tabs ref for auto-reload listeners
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // Handle external file changes (e.g. edited in VS Code, Git, or external tool)
  const handleReloadExternalFile = useCallback(async (filePath) => {
    const normPath = (filePath || '').replace(/\\/g, '/');
    const existingTab = tabsRef.current.find(
      (t) => t.path === normPath || t.path.replace(/\\/g, '/') === normPath
    );
    if (!existingTab) return;

    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(normPath)}`);
      const data = await res.json();
      if (data.success) {
        setTabs((prev) =>
          prev.map((t) => {
            const isMatch = t.path === normPath || t.path.replace(/\\/g, '/') === normPath;
            if (!isMatch) return t;

            // Only update if not dirty and content actually differs
            if (!t.isDirty && t.content !== data.content) {
              return {
                ...t,
                content: data.content,
                originalContent: data.content,
                isDirty: false
              };
            }
            return t;
          })
        );

        if (!existingTab.isDirty && existingTab.content !== data.content) {
          setSaveStatus(`Diperbarui dari luar: ${existingTab.name}`);
          setTimeout(() => setSaveStatus(''), 2500);
        }
      }
    } catch (err) {
      console.warn('[AutoReload] Gagal memuat file yang berubah:', err);
    }
  }, []);

  // Real-time File Watcher via Server-Sent Events (SSE)
  useEffect(() => {
    let es = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      es = new EventSource('/api/events');

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'file-changed') {
            handleReloadExternalFile(data.path);
          } else if (data.type === 'tree-changed' || data.type === 'file-deleted') {
            fetchTree();
          } else if (data.type === 'workspace-changed') {
            fetchWorkspaceInfo();
            fetchTree();
          }
        } catch (e) {
          // ignore non-json messages (like ping)
        }
      };

      es.onerror = () => {
        es.close();
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    return () => {
      clearTimeout(reconnectTimeout);
      if (es) es.close();
    };
  }, [fetchTree, fetchWorkspaceInfo, handleReloadExternalFile]);

  // Window Focus Auto-Reload: Sync with disk when switching back from VS Code/external apps
  useEffect(() => {
    const handleWindowFocus = async () => {
      // 1. Refresh file tree in background
      fetchTree();

      // 2. Check all clean open tabs for disk modifications
      const currentTabs = tabsRef.current;
      const cleanTabs = currentTabs.filter((t) => !t.isDirty);
      if (cleanTabs.length === 0) return;

      for (const tab of cleanTabs) {
        try {
          const res = await fetch(`/api/file?path=${encodeURIComponent(tab.path)}`);
          const data = await res.json();
          if (data.success && data.content !== tab.originalContent) {
            setTabs((prev) =>
              prev.map((t) =>
                t.path === tab.path && !t.isDirty
                  ? { ...t, content: data.content, originalContent: data.content }
                  : t
              )
            );
            setSaveStatus(`Diperbarui dari disk: ${tab.name}`);
            setTimeout(() => setSaveStatus(''), 2500);
          }
        } catch (e) {}
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [fetchTree]);

  // Global drag-and-drop: drop a folder from Windows Desktop into the IDE
  const handleGlobalDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const filePath = (window.electronAPI && typeof window.electronAPI.getPathForFile === 'function')
        ? window.electronAPI.getPathForFile(file)
        : file.path;
      if (filePath) {
        handleOpenFolder(filePath);
      }
    }
  };

  // Tab management
  const handleSelectTab = (path) => {
    setActiveTabPath(path);
  };

  const handleCloseTab = (path) => {
    const tabToClose = tabs.find((t) => t.path === path);
    if (tabToClose?.isDirty) {
      const confirmClose = window.confirm(`File "${tabToClose.name}" belum disimpan. Tutup tanpa menyimpan?`);
      if (!confirmClose) return;
    }

    const nextTabs = tabs.filter((t) => t.path !== path);
    setTabs(nextTabs);
    if (activeTabPath === path) {
      if (nextTabs.length > 0) {
        setActiveTabPath(nextTabs[nextTabs.length - 1].path);
      } else {
        setActiveTabPath(null);
      }
    }
  };

  // Content change inside editor
  const handleContentChange = (path, newContent) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.path === path) {
          return {
            ...tab,
            content: newContent,
            isDirty: newContent !== tab.originalContent
          };
        }
        return tab;
      })
    );
  };

  // Save current active file
  const handleSaveFile = async (path = activeTabPath, contentOverride = null) => {
    const targetPath = path || activeTabPath;
    const tab = tabs.find((t) => t.path === targetPath);
    if (!tab) return;
    const finalContent = contentOverride !== null ? contentOverride : tab.content;

    try {
      const res = await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: tab.path, content: finalContent })
      });
      const data = await res.json();
      if (data.success) {
        setTabs((prev) =>
          prev.map((t) => (t.path === targetPath ? { ...t, content: finalContent, originalContent: finalContent, isDirty: false } : t))
        );
        setSaveStatus(`Tersimpan: ${tab.name}`);
        setTimeout(() => setSaveStatus(''), 2500);
      } else {
        alert(`Gagal menyimpan file: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to save file:', err);
      alert('Koneksi terputus saat menyimpan file.');
    }
  };

  // Save ALL dirty tabs at once (Crucial for multi-file projects like Java/C++/C)
  const handleSaveAllDirty = async () => {
    const dirtyTabs = tabs.filter((t) => t.isDirty);
    if (dirtyTabs.length === 0) return;

    await Promise.all(
      dirtyTabs.map(async (tab) => {
        try {
          await fetch('/api/file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: tab.path, content: tab.content })
          });
        } catch (err) {
          console.error('Failed to auto-save tab:', tab.path, err);
        }
      })
    );

    setTabs((prev) =>
      prev.map((t) => ({ ...t, originalContent: t.content, isDirty: false }))
    );
  };

  // Keep latest references for global shortcut handlers
  const handleSaveFileRef = useRef();
  handleSaveFileRef.current = handleSaveFile;
  const handleSaveAllDirtyRef = useRef();
  handleSaveAllDirtyRef.current = handleSaveAllDirty;
  const handleOpenFolderRef = useRef();
  handleOpenFolderRef.current = handleOpenFolder;

  // Global keyboard shortcuts (Ctrl+S to save, Ctrl+Shift+S save all, Ctrl+O to open folder)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (handleSaveAllDirtyRef.current) {
          handleSaveAllDirtyRef.current();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (handleSaveFileRef.current) {
          handleSaveFileRef.current();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        if (handleOpenFolderRef.current) {
          handleOpenFolderRef.current();
        }
      } else if (isCmdOrCtrl && (e.key === '`' || e.key.toLowerCase() === 'j')) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced Auto-Save: Automatically saves active file ~1000ms after user stops typing
  useEffect(() => {
    if (!editorSettings.autoSave) return;
    const currentTab = tabs.find((t) => t.path === activeTabPath);
    if (!currentTab || !currentTab.isDirty) return;

    const timer = setTimeout(() => {
      handleSaveFile(currentTab.path);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tabs, activeTabPath, editorSettings.autoSave]);

  // File Operations: Create
  const handleCreateItem = async (relPath, type) => {
    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: relPath, type })
      });
      const data = await res.json();
      if (data.success) {
        await fetchTree();
        if (type === 'file') {
          handleOpenFile(relPath);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // File Operations: Delete
  const handleDeleteItem = async (relPath) => {
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: relPath })
      });
      const data = await res.json();
      if (data.success) {
        setTabs((prev) => {
          const remaining = prev.filter((t) => t.path !== relPath && !t.path.startsWith(relPath + '/'));
          if (!remaining.find((t) => t.path === activeTabPath)) {
            setActiveTabPath(remaining.length > 0 ? remaining[remaining.length - 1].path : null);
          }
          return remaining;
        });
        fetchTree();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // File Operations: Rename
  const handleRenameItem = async (oldPath, newPath) => {
    try {
      const res = await fetch('/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath })
      });
      const data = await res.json();
      if (data.success) {
        const newName = newPath.split('/').pop();
        setTabs((prev) =>
          prev.map((t) => {
            if (t.path === oldPath) {
              return { ...t, path: newPath, name: newName };
            }
            if (t.path.startsWith(oldPath + '/')) {
              const subPath = t.path.slice(oldPath.length);
              return { ...t, path: `${newPath}${subPath}` };
            }
            return t;
          })
        );
        if (activeTabPath === oldPath) {
          setActiveTabPath(newPath);
        } else if (activeTabPath && activeTabPath.startsWith(oldPath + '/')) {
          const subPath = activeTabPath.slice(oldPath.length);
          setActiveTabPath(`${newPath}${subPath}`);
        }
        fetchTree();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // File Operations: Move
  const handleMoveItem = async (sourcePath, targetDir) => {
    try {
      const fileName = sourcePath.split('/').pop();
      const destPath = targetDir ? `${targetDir}/${fileName}` : fileName;
      if (destPath === sourcePath) return;

      const res = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePath, targetDir })
      });
      const data = await res.json();
      if (data.success) {
        setTabs((prev) =>
          prev.map((t) => {
            if (t.path === sourcePath) {
              return { ...t, path: destPath, name: fileName };
            }
            if (t.path.startsWith(sourcePath + '/')) {
              const subPath = t.path.slice(sourcePath.length);
              return { ...t, path: `${destPath}${subPath}` };
            }
            return t;
          })
        );
        if (activeTabPath === sourcePath) {
          setActiveTabPath(destPath);
        } else if (activeTabPath && activeTabPath.startsWith(sourcePath + '/')) {
          const subPath = activeTabPath.slice(sourcePath.length);
          setActiveTabPath(`${destPath}${subPath}`);
        }
        await fetchTree();
      } else {
        alert(data.error || 'Gagal memindahkan item.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memindahkan item.');
    }
  };

  const activeEventSourceRef = useRef(null);

  // Stream execution helper (SSE)
  const executeProcess = (url) => {
    if (activeEventSourceRef.current) {
      activeEventSourceRef.current.close();
    }
    setIsTerminalOpen(true);
    setIsRunning(true);
    setTerminalOutput((prev) => prev + `\n`);

    const eventSource = new EventSource(url);
    activeEventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'stdout' || payload.type === 'stderr') {
          setTerminalOutput((prev) => prev + payload.data);
        } else if (payload.type === 'exit') {
          setIsRunning(false);
          eventSource.close();
          activeEventSourceRef.current = null;
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsRunning(false);
      eventSource.close();
      activeEventSourceRef.current = null;
    };
  };

  const handleStopProcess = () => {
    if (activeEventSourceRef.current) {
      activeEventSourceRef.current.close();
      activeEventSourceRef.current = null;
    }
    setIsRunning(false);
    setTerminalOutput((prev) => prev + `\n[Proses dihentikan oleh pengguna]\n`);
  };

  // Run current active file
  const handleRunCode = async () => {
    if (!activeTabPath || isRunning) return;

    // Automatically save ALL dirty tabs before compilation/running (so multi-file Java/C++ works!)
    await handleSaveAllDirty();

    executeProcess(`/api/run?path=${encodeURIComponent(activeTabPath)}`);
  };

  // Run custom terminal command
  const handleRunCustomCommand = (cmd) => {
    if (isRunning) return;
    executeProcess(`/api/run?cmd=${encodeURIComponent(cmd)}`);
  };

  const activeTab = tabs.find((t) => t.path === activeTabPath);
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI);
  const theme = getTheme(editorSettings.theme);

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleGlobalDrop}
      style={{
        backgroundColor: theme.app.bg,
        color: theme.app.text
      }}
      className={`flex flex-col h-screen w-screen overflow-hidden transition-colors ${theme.isLight ? 'light' : ''}`}
    >
      {/* Sleek Custom App Header (Spotify / Antigravity Style) */}
      <header 
        style={{ 
          WebkitAppRegion: 'drag',
          backgroundColor: theme.header.bg,
          borderColor: theme.header.border,
          color: theme.header.text
        }}
        className="h-[32px] min-h-[32px] border-b flex items-center justify-between px-3 select-none text-xs shrink-0 z-30 transition-colors"
      >
        {/* Left: Brand Emblem & Workspace */}
        <div className="flex items-center space-x-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shadow-xs">
            <img src="/emblem.png" alt="Nemesis IDE" className="w-full h-full object-contain" />
          </div>
          <span 
            style={{ color: theme.header.brandText }}
            className="font-bold text-[11px] tracking-wide"
          >
            Nemesis IDE
          </span>
          <span style={{ color: theme.header.border }}>/</span>
          <button 
            onClick={() => handleOpenFolder()}
            title="Klik untuk membuka folder project (Ctrl + O)"
            style={{
              backgroundColor: theme.header.badgeBg,
              borderColor: theme.header.badgeBorder,
              color: theme.header.badgeText
            }}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors border ${theme.header.badgeHover}`}
          >
            <Folder size={11} className="text-amber-400" />
            <span className="truncate max-w-[160px] font-medium">{workspaceInfo?.name || 'Workspace'}</span>
          </button>
        </div>

        {/* Center: Window Title */}
        <div 
          style={{ color: theme.header.titleText }}
          className="text-[11px] font-medium truncate max-w-sm hidden sm:block"
        >
          {workspaceInfo?.name ? `${workspaceInfo.name} — Nemesis IDE` : 'Nemesis IDE'}
        </div>

        {/* Right: Spacer for native titleBarOverlay controls in Electron, or subtle badge in browser */}
        <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' }}>
          {isElectron ? (
            <div className="w-[138px]" />
          ) : (
            <span 
              style={{
                backgroundColor: theme.header.webBadgeBg,
                borderColor: theme.header.webBadgeBorder,
                color: theme.header.webBadgeText
              }}
              className="text-[10px] px-1.5 py-0.5 rounded border"
            >
              Web Mode
            </span>
          )}
        </div>
      </header>

      {/* Top Main Workspace Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Leftmost Activity Bar */}
        <ActivityBar
          activeView={activeView}
          setActiveView={setActiveView}
          isTerminalOpen={isTerminalOpen}
          setIsTerminalOpen={setIsTerminalOpen}
          onRunCode={handleRunCode}
          isRunning={isRunning}
          theme={theme}
        />

        {/* Sidebar / Tree View */}
        <Sidebar
          activeView={activeView}
          tree={tree}
          activeTabPath={activeTabPath}
          workspaceInfo={workspaceInfo}
          onOpenFolder={handleOpenFolder}
          onOpenFile={handleOpenFile}
          onRefresh={fetchTree}
          onCreateItem={handleCreateItem}
          onDeleteItem={handleDeleteItem}
          onRenameItem={handleRenameItem}
          onMoveItem={handleMoveItem}
          editorSettings={editorSettings}
          setEditorSettings={setEditorSettings}
          theme={theme}
        />

        {/* Center & Right: Editor Area + Integrated Terminal */}
        <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden">
          <EditorArea
            tabs={tabs}
            activeTabPath={activeTabPath}
            workspaceInfo={workspaceInfo}
            onOpenFolder={handleOpenFolder}
            onCreateItem={handleCreateItem}
            onOpenFile={handleOpenFile}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onContentChange={handleContentChange}
            onSaveFile={handleSaveFile}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            editorSettings={editorSettings}
            onCursorChange={(line, col) => setCursorPosition({ line, col })}
            theme={theme}
          />

          {/* Bottom Integrated Terminal */}
          <TerminalPanel
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            output={terminalOutput}
            onClear={() => setTerminalOutput('')}
            isRunning={isRunning}
            onRunCustomCommand={handleRunCustomCommand}
            onStopProcess={handleStopProcess}
            theme={theme}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        activeFile={activeTab}
        cursorPosition={cursorPosition}
        serverStatus={serverStatus}
        tabSize={editorSettings.tabSize}
        saveStatus={saveStatus}
        theme={theme}
      />
    </div>
  );
}
