import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Folder } from 'lucide-react';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';

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
  const [editorSettings, setEditorSettings] = useState({
    theme: 'nemesis-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: true
  });

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

  // Global keyboard shortcuts (Ctrl+O to open folder)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFolder();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  const handleSaveFile = async (path = activeTabPath) => {
    const tab = tabs.find((t) => t.path === path);
    if (!tab) return;

    try {
      const res = await fetch('/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: tab.path, content: tab.content })
      });
      const data = await res.json();
      if (data.success) {
        setTabs((prev) =>
          prev.map((t) => (t.path === path ? { ...t, originalContent: t.content, isDirty: false } : t))
        );
        setSaveStatus(`Tersimpan: ${tab.name}`);
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        alert(`Gagal menyimpan file: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to save file:', err);
      alert('Koneksi terputus saat menyimpan file.');
    }
  };

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

    // Save first before running if dirty
    const currentTab = tabs.find((t) => t.path === activeTabPath);
    if (currentTab?.isDirty) {
      await handleSaveFile(activeTabPath);
    }

    executeProcess(`/api/run?path=${encodeURIComponent(activeTabPath)}`);
  };

  // Run custom terminal command
  const handleRunCustomCommand = (cmd) => {
    if (isRunning) return;
    executeProcess(`/api/run?cmd=${encodeURIComponent(cmd)}`);
  };

  const activeTab = tabs.find((t) => t.path === activeTabPath);

    const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI);

    return (
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleGlobalDrop}
        className="flex flex-col h-screen w-screen overflow-hidden bg-[#18181b] text-gray-200"
      >
        {/* Sleek Custom App Header (Spotify / Antigravity Style) */}
        <header 
          style={{ WebkitAppRegion: 'drag' }}
          className="h-[32px] min-h-[32px] bg-[#141416] border-b border-[#27272a] flex items-center justify-between px-3 select-none text-xs text-zinc-400 shrink-0 z-30"
        >
          {/* Left: Brand Emblem & Workspace */}
          <div className="flex items-center space-x-2" style={{ WebkitAppRegion: 'no-drag' }}>
            <div className="w-4 h-4 rounded overflow-hidden flex items-center justify-center bg-[#040b1b] border border-purple-500/30">
              <img src="/emblem.png" alt="Nemesis IDE" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-zinc-200 text-[11px] tracking-wide">Nemesis IDE</span>
            <span className="text-zinc-600">/</span>
            <button 
              onClick={() => handleOpenFolder()}
              title="Klik untuk membuka folder project (Ctrl + O)"
              className="flex items-center space-x-1 text-zinc-300 hover:text-white bg-[#1e1e24] hover:bg-[#27272a] px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors border border-[#2e2e34]"
            >
              <Folder size={11} className="text-amber-400" />
              <span className="truncate max-w-[160px] font-medium">{workspaceInfo?.name || 'Workspace'}</span>
            </button>
          </div>

          {/* Center: Window Title */}
          <div className="text-[11px] font-medium text-zinc-400 truncate max-w-sm hidden sm:block">
            {workspaceInfo?.name ? `${workspaceInfo.name} — Nemesis IDE` : 'Nemesis IDE'}
          </div>

          {/* Right: Spacer for native titleBarOverlay controls in Electron, or subtle badge in browser */}
          <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' }}>
            {isElectron ? (
              <div className="w-[138px]" />
            ) : (
              <span className="text-[10px] text-zinc-500 bg-[#1e1e24] px-1.5 py-0.5 rounded border border-[#27272a]">
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
        />

        {/* Center & Right: Editor Area + Integrated Terminal */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <EditorArea
            tabs={tabs}
            activeTabPath={activeTabPath}
            workspaceInfo={workspaceInfo}
            onOpenFolder={handleOpenFolder}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onContentChange={handleContentChange}
            onSaveFile={handleSaveFile}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            editorSettings={editorSettings}
            onCursorChange={(line, col) => setCursorPosition({ line, col })}
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
      />
    </div>
  );
}
