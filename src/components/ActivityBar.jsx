import React, { useState, useRef, useEffect } from 'react';
import { 
  Files, Search, GitBranch, Bug, Blocks, 
  Settings, User, Check
} from 'lucide-react';

export default function ActivityBar({ 
  activeView, 
  setActiveView, 
  isSidebarOpen, 
  setIsSidebarOpen,
  gitChangesCount = 0
}) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null);

  // Close settings popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (viewId) => {
    if (activeView === viewId && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveView(viewId);
      setIsSidebarOpen(true);
    }
  };

  const topItems = [
    { id: 'explorer', label: 'Explorer (Ctrl+Shift+E)', icon: Files },
    { id: 'search', label: 'Search (Ctrl+Shift+F)', icon: Search },
    { 
      id: 'source-control', 
      label: 'Source Control (Ctrl+Shift+G)', 
      icon: GitBranch,
      badge: gitChangesCount > 0 ? gitChangesCount : null
    },
    { id: 'run-debug', label: 'Run and Debug (Ctrl+Shift+D)', icon: Bug },
    { id: 'extensions', label: 'Extensions (Ctrl+Shift+X)', icon: Blocks },
  ];

  return (
    <aside className="w-[48px] min-w-[48px] bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-2 select-none z-20 shrink-0">
      {/* Top Nav Items */}
      <div className="flex flex-col space-y-1 w-full items-center">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id && isSidebarOpen;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={item.label}
              className={`w-full h-11 flex items-center justify-center relative transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-[#858585] hover:text-white'
              }`}
            >
              {/* VS Code Active Left Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white rounded-r-sm" />
              )}
              
              <Icon size={22} strokeWidth={1.5} />

              {/* Badge for Git or Notifications */}
              {item.badge && (
                <span className="absolute bottom-1.5 right-2 min-w-[14px] h-[14px] bg-[#007acc] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Nav Items: Profile and Settings */}
      <div className="mt-auto flex flex-col space-y-1 w-full items-center relative" ref={settingsMenuRef}>
        {/* Profile / Accounts */}
        <button
          onClick={() => handleNavClick('about')}
          title="Accounts / Profile"
          className={`w-full h-11 flex items-center justify-center relative transition-colors ${
            activeView === 'about' && isSidebarOpen
              ? 'text-white'
              : 'text-[#858585] hover:text-white'
          }`}
        >
          {activeView === 'about' && isSidebarOpen && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white rounded-r-sm" />
          )}
          <User size={21} strokeWidth={1.5} />
        </button>

        {/* Settings Gear */}
        <button
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          title="Manage / Settings"
          className={`w-full h-11 flex items-center justify-center relative transition-colors ${
            (showSettingsMenu || (activeView === 'settings' && isSidebarOpen))
              ? 'text-white'
              : 'text-[#858585] hover:text-white'
          }`}
        >
          {activeView === 'settings' && isSidebarOpen && (
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white rounded-r-sm" />
          )}
          <Settings size={21} strokeWidth={1.5} />
        </button>

        {/* Settings Popup Menu */}
        {showSettingsMenu && (
          <div className="absolute left-full bottom-2 ml-1 w-52 bg-[#1f1f1f] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-xs">
            <button
              onClick={() => {
                setShowSettingsMenu(false);
                setActiveView('settings');
                setIsSidebarOpen(true);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white flex justify-between text-[#cccccc]"
            >
              <span>Settings</span>
              <span className="text-[#858585] text-[11px]">Ctrl+,</span>
            </button>
            <button
              onClick={() => {
                setShowSettingsMenu(false);
                setActiveView('settings');
                setIsSidebarOpen(true);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white text-[#cccccc]"
            >
              <span>Themes</span>
            </button>
            <div className="h-px bg-[#333333] my-1" />
            <button
              onClick={() => {
                setShowSettingsMenu(false);
                setActiveView('about');
                setIsSidebarOpen(true);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#04395e] hover:text-white text-[#cccccc]"
            >
              <span>About Nemesis IDE</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
