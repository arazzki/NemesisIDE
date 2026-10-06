import React, { useState, useEffect, useCallback } from 'react';
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
  const [editorSettings, setEditorSettings] = useState({
    theme: 'nemesis-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: true
  });

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

  // Initial load: fetch tree and open default file if available
  useEffect(() => {
    fetchTree().then((initialTree) => {
      if (initialTree && initialTree.length > 0) {
        const firstFile = initialTree.find((i) => i.type === 'file') || (initialTree[0].children && initialTree[0].children[0]);
        if (firstFile) {
          handleOpenFile(firstFile.path);
        }
      }
    });
  }, [fetchTree]);

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

    eventSource.onerror = (err) => {
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

  const activeTab = tabs.find((t) => t.path === activeTabPath);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#18181b] text-gray-200">
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
