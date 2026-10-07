import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowLeft, ArrowRight, Columns2, 
  PanelLeft, PanelBottom, PanelRight, Minus, Square, X,
  Check
} from 'lucide-react';

export default function TitleBar({
  workspaceInfo,
  onOpenCommandPalette,
  onOpenFolder,
  onNewFile,
  onNewFolder,
  onSaveFile,
  onRunCode,
  isSidebarOpen,
  onToggleSidebar,
  isTerminalOpen,
  onToggleTerminal,
  editorSettings,
  setEditorSettings,
  activeView,
  setActiveView
}) {
  const [openMenu, setOpenMenu] = useState(null); // 'file', 'edit', 'selection', 'view', 'go', 'run', 'terminal', 'help'
  const menuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleMenuHover = (menuName) => {
    if (openMenu !== null) {
      setOpenMenu(menuName);
    }
  };

  const closeMenuAndRun = (action) => {
    setOpenMenu(null);
    if (action) action();
  };

  return (
    <header className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between px-2 select-none text-[12px] text-[#cccccc] z-30 shrink-0">
      {/* Left Section: Logo, Menus, Nav Arrows */}
      <div className="flex items-center space-x-1" ref={menuRef}>
        {/* VS Code Style Blue Ribbon Logo */}
        <div 
          onClick={() => setActiveView && setActiveView('about')}
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#313131] cursor-pointer mr-1 transition-colors"
          title="Nemesis IDE"
        >
          <svg className="w-4 h-4 text-[#007acc]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 2.5L7.2 10.3L2.5 6.7L1 7.8L5.5 12L1 16.2L2.5 17.3L7.2 13.7L17.5 21.5L23 18.5V5.5L17.5 2.5ZM17.5 6.8V17.2L9.5 12L17.5 6.8Z"/>
          </svg>
        </div>

        {/* Menu Items */}
        <div className="flex items-center space-x-0.5 relative">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('file')}
              onMouseEnter={() => handleMenuHover('file')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'file' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              File
            </button>
            {openMenu === 'file' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(onNewFile)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>New File...</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+N</span>
                </button>
                <button
                  onClick={() => closeMenuAndRun(onNewFolder)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>New Folder...</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(onOpenFolder)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Open Folder...</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+O</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(onSaveFile)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Save</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+S</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(() => setActiveView('settings'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Preferences</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+,</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('edit')}
              onMouseEnter={() => handleMenuHover('edit')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'edit' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Edit
            </button>
            {openMenu === 'edit' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(() => document.execCommand('undo'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Undo</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => closeMenuAndRun(() => document.execCommand('redo'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Redo</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Y</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(() => onOpenCommandPalette('commands'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Find in Workspace</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Shift+F</span>
                </button>
              </div>
            )}
          </div>

          {/* Selection Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('selection')}
              onMouseEnter={() => handleMenuHover('selection')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'selection' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Selection
            </button>
            {openMenu === 'selection' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(() => document.execCommand('selectAll'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Select All</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+A</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('view')}
              onMouseEnter={() => handleMenuHover('view')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'view' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              View
            </button>
            {openMenu === 'view' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(() => onOpenCommandPalette('commands'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Command Palette...</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Shift+P</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(() => setActiveView('explorer'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Explorer</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Shift+E</span>
                </button>
                <button
                  onClick={() => closeMenuAndRun(() => setActiveView('search'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Search</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Shift+F</span>
                </button>
                <button
                  onClick={() => closeMenuAndRun(() => setActiveView('source-control'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Source Control</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+Shift+G</span>
                </button>
                <div className="h-px bg-[#333333] my-1" />
                <button
                  onClick={() => closeMenuAndRun(onToggleTerminal)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Terminal</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+`</span>
                </button>
                <button
                  onClick={() => closeMenuAndRun(onToggleSidebar)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Toggle Primary Side Bar</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+B</span>
                </button>
              </div>
            )}
          </div>

          {/* Go Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('go')}
              onMouseEnter={() => handleMenuHover('go')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'go' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Go
            </button>
            {openMenu === 'go' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(() => onOpenCommandPalette('files'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Go to File...</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>

          {/* Run Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('run')}
              onMouseEnter={() => handleMenuHover('run')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'run' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Run
            </button>
            {openMenu === 'run' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(onRunCode)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Start Debugging / Run</span>
                  <span className="text-[#858585] text-[11px]">F5</span>
                </button>
              </div>
            )}
          </div>

          {/* Terminal Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('terminal')}
              onMouseEnter={() => handleMenuHover('terminal')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'terminal' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Terminal
            </button>
            {openMenu === 'terminal' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(onToggleTerminal)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between"
                >
                  <span>Toggle Terminal</span>
                  <span className="text-[#858585] text-[11px]">Ctrl+`</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('help')}
              onMouseEnter={() => handleMenuHover('help')}
              className={`px-2 py-1 rounded hover:bg-[#313131] text-xs transition-colors ${
                openMenu === 'help' ? 'bg-[#313131] text-white' : 'text-[#cccccc]'
              }`}
            >
              Help
            </button>
            {openMenu === 'help' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => closeMenuAndRun(() => setActiveView('about'))}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white"
                >
                  About Nemesis IDE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows (< >) */}
        <div className="flex items-center space-x-0.5 ml-1">
          <button 
            title="Go Back"
            className="p-1 rounded text-[#808080] hover:text-[#cccccc] hover:bg-[#313131] transition-colors"
          >
            <ArrowLeft size={13} />
          </button>
          <button 
            title="Go Forward"
            className="p-1 rounded text-[#808080] hover:text-[#cccccc] hover:bg-[#313131] transition-colors"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Center Section: Quick Open / Search Pill Bar */}
      <div className="flex-1 max-w-[500px] mx-4">
        <button
          onClick={() => onOpenCommandPalette('files')}
          className="w-full h-[24px] bg-[#222222] hover:bg-[#2a2a2a] border border-[#3c3c3c] hover:border-[#007acc] rounded-[6px] px-3 flex items-center justify-between text-[#858585] hover:text-[#cccccc] transition-all shadow-sm group"
          title="Search files and commands (Ctrl + P)"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search size={13} className="text-[#858585] group-hover:text-[#007acc]" />
            <span className="text-[12px] truncate font-sans text-[#a0a0a0]">
              {workspaceInfo?.name || 'Nemesis IDE'}
            </span>
          </div>
          <kbd className="text-[10px] bg-[#2d2d2d] group-hover:bg-[#383838] text-[#808080] group-hover:text-[#bbbbbb] px-1.5 py-0.2 rounded font-mono">
            Ctrl+P
          </kbd>
        </button>
      </div>

      {/* Right Section: Layout Controls & Window Buttons */}
      <div className="flex items-center space-x-1">
        {/* Layout Action Icons */}
        <div className="flex items-center space-x-0.5 mr-2">
          {/* Split Editor */}
          <button
            onClick={() => {}}
            title="Split Editor Right"
            className="p-1.5 rounded hover:bg-[#313131] text-[#9d9d9d] hover:text-[#cccccc] transition-colors"
          >
            <Columns2 size={14} />
          </button>

          {/* Toggle Primary Side Bar */}
          <button
            onClick={onToggleSidebar}
            title="Toggle Primary Side Bar (Ctrl + B)"
            className={`p-1.5 rounded transition-colors ${
              isSidebarOpen
                ? 'bg-[#2a2a2a] text-[#ffffff]'
                : 'text-[#9d9d9d] hover:bg-[#313131] hover:text-[#cccccc]'
            }`}
          >
            <PanelLeft size={14} />
          </button>

          {/* Toggle Bottom Terminal Panel */}
          <button
            onClick={onToggleTerminal}
            title="Toggle Panel (Ctrl + `)"
            className={`p-1.5 rounded transition-colors ${
              isTerminalOpen
                ? 'bg-[#2a2a2a] text-[#ffffff]'
                : 'text-[#9d9d9d] hover:bg-[#313131] hover:text-[#cccccc]'
            }`}
          >
            <PanelBottom size={14} />
          </button>

          {/* Toggle Minimap / Secondary Side Bar */}
          <button
            onClick={() => setEditorSettings(s => ({ ...s, minimap: !s.minimap }))}
            title="Toggle Minimap"
            className={`p-1.5 rounded transition-colors ${
              editorSettings?.minimap
                ? 'bg-[#2a2a2a] text-[#ffffff]'
                : 'text-[#9d9d9d] hover:bg-[#313131] hover:text-[#cccccc]'
            }`}
          >
            <PanelRight size={14} />
          </button>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center">
          <button 
            className="w-8 h-[28px] flex items-center justify-center hover:bg-[#313131] text-[#9d9d9d] hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus size={13} />
          </button>
          <button 
            className="w-8 h-[28px] flex items-center justify-center hover:bg-[#313131] text-[#9d9d9d] hover:text-white transition-colors"
            title="Maximize"
          >
            <Square size={11} />
          </button>
          <button 
            className="w-8 h-[28px] flex items-center justify-center hover:bg-[#e81123] text-[#9d9d9d] hover:text-white transition-colors"
            title="Close"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
