import React, { useState, useEffect, useCallback, useRef } from 'react';
import TitleBar from './components/TitleBar';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';

export default function App() {
  const [activeView, setActiveView] = useState('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteMode, setCommandPaletteMode] = useState('files'); // 'files' | 'commands'

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
    theme: 'vs-dark-modern',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: true
  });

  const editorAreaRef = useRef(null);

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

  // Stream execution helper (SSE)
  const executeProcess = (url) => {
    setIsTerminalOpen(true);
    setIsRunning(true);
    setTerminalOutput((prev) => prev + `\n`);

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'stdout' || payload.type === 'stderr') {
          setTerminalOutput((prev) => prev + payload.data);
        } else if (payload.type === 'exit') {
          setIsRunning(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsRunning(false);
      eventSource.close();
    };
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

  // Global keyboard shortcuts (VS Code style)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Ctrl + P: Quick Open Files
      if (isCtrlOrMeta && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteMode('files');
        setIsCommandPaletteOpen(true);
      }
      // Ctrl + Shift + P: Command Palette
      else if (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteMode('commands');
        setIsCommandPaletteOpen(true);
      }
      // Ctrl + B: Toggle primary sidebar
      else if (isCtrlOrMeta && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      // Ctrl + ` (backtick): Toggle terminal
      else if (isCtrlOrMeta && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      // Ctrl + O: Open folder
      else if (isCtrlOrMeta && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFolder();
      }
      // Ctrl + S: Save file
      else if (isCtrlOrMeta && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveFile();
      }
      // F5: Run code
      else if (e.key === 'F5') {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabPath, tabs]);

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

  const handleOpenCommandPalette = (mode = 'files') => {
    setCommandPaletteMode(mode);
    setIsCommandPaletteOpen(true);
  };

  const activeTab = tabs.find((t) => t.path === activeTabPath);

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleGlobalDrop}
      className="flex flex-col h-screen w-screen overflow-hidden bg-[#181818] text-[#cccccc] font-sans select-none"
    >
      {/* 1. Top Window / Menu / Title Bar */}
      <TitleBar
        workspaceInfo={workspaceInfo}
        onOpenCommandPalette={handleOpenCommandPalette}
        onOpenFolder={handleOpenFolder}
        onNewFile={() => {
          const name = prompt('Masukkan nama file baru:');
          if (name) handleCreateItem(name, 'file');
        }}
        onNewFolder={() => {
          const name = prompt('Masukkan nama folder baru:');
          if (name) handleCreateItem(name, 'directory');
        }}
        onSaveFile={handleSaveFile}
        onRunCode={handleRunCode}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isTerminalOpen={isTerminalOpen}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        editorSettings={editorSettings}
        setEditorSettings={setEditorSettings}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* 2. Main Workspace Body Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Leftmost Activity Bar */}
        <ActivityBar
          activeView={activeView}
          setActiveView={setActiveView}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Sidebar / Multi-View Panels */}
        {isSidebarOpen && (
          <Sidebar
            activeView={activeView}
            tree={tree}
            activeTabPath={activeTabPath}
            activeFile={activeTab}
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
            onNavigateLine={(line) => editorAreaRef.current?.revealLine(line)}
            onRunCode={handleRunCode}
            isRunning={isRunning}
          />
        )}

        {/* Center & Right: Editor Area + Integrated Terminal */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <EditorArea
            ref={editorAreaRef}
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
            cursorPosition={cursorPosition}
            onCursorChange={(line, col) => setCursorPosition({ line, col })}
          />

          {/* Bottom Integrated Terminal Panel */}
          <TerminalPanel
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            output={terminalOutput}
            onClear={() => setTerminalOutput('')}
            isRunning={isRunning}
            onRunCustomCommand={handleRunCustomCommand}
          />
        </div>
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar
        activeFile={activeTab}
        cursorPosition={cursorPosition}
        serverStatus={serverStatus}
        tabSize={editorSettings.tabSize}
        saveStatus={saveStatus}
        onOpenLanguageSelect={() => handleOpenCommandPalette('commands')}
      />

      {/* 4. Quick Open & Command Palette Modal Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        initialMode={commandPaletteMode}
        tree={tree}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onNewFile={() => {
          const name = prompt('Masukkan nama file baru:');
          if (name) handleCreateItem(name, 'file');
        }}
        onNewFolder={() => {
          const name = prompt('Masukkan nama folder baru:');
          if (name) handleCreateItem(name, 'directory');
        }}
        onSaveFile={handleSaveFile}
        onRunCode={handleRunCode}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleMinimap={() => setEditorSettings((s) => ({ ...s, minimap: !s.minimap }))}
        onToggleWordWrap={() => setEditorSettings((s) => ({ ...s, wordWrap: s.wordWrap === 'on' ? 'off' : 'on' }))}
        onSelectView={(v) => {
          setActiveView(v);
          setIsSidebarOpen(true);
        }}
        editorSettings={editorSettings}
        setEditorSettings={setEditorSettings}
      />
    </div>
  );
}
