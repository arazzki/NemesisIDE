import React from 'react';
import { Files, Terminal, Settings, Play, Info } from 'lucide-react';
import { getTheme } from '../utils/themeHelper';

export default function ActivityBar({ 
  activeView, 
  setActiveView, 
  isTerminalOpen, 
  setIsTerminalOpen, 
  onRunCode, 
  isRunning,
  theme: userTheme
}) {
  const theme = userTheme || getTheme('nemesis-dark');

  return (
    <aside 
      style={{ 
        backgroundColor: theme.activityBar.bg, 
        borderColor: theme.activityBar.border 
      }}
      className="w-12 border-r flex flex-col items-center py-3 select-none z-20 transition-colors"
    >
      {/* Brand Icon (Spotify style circular emblem) */}
      <div className="w-8 h-8 rounded-full overflow-hidden mb-6 shadow-md shadow-black/40 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
        <img src="/emblem.png" alt="Nemesis IDE" className="w-full h-full object-contain" />
      </div>

      {/* Top Nav Items */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setActiveView('explorer')}
          title="Explorer (Files)"
          style={{
            backgroundColor: activeView === 'explorer' ? theme.activityBar.activeBg : 'transparent',
            color: activeView === 'explorer' ? theme.activityBar.activeText : theme.activityBar.inactiveText
          }}
          className={`p-2 rounded-lg transition-colors relative ${activeView !== 'explorer' ? theme.activityBar.hoverBg : ''}`}
        >
          {activeView === 'explorer' && (
            <div className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 ${theme.activityBar.indicatorBg} rounded-r`} />
          )}
          <Files size={20} />
        </button>

        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          title="Toggle Integrated Terminal"
          style={{
            backgroundColor: isTerminalOpen ? theme.activityBar.activeBg : 'transparent',
            color: isTerminalOpen ? (theme.isLight ? '#2563eb' : '#60a5fa') : theme.activityBar.inactiveText
          }}
          className={`p-2 rounded-lg transition-colors relative ${!isTerminalOpen ? theme.activityBar.hoverBg : ''}`}
        >
          <Terminal size={20} />
        </button>

        <button
          onClick={onRunCode}
          disabled={isRunning}
          title="Run Current File"
          className={`p-2 rounded-lg transition-all ${
            isRunning
              ? 'text-zinc-500 animate-pulse'
              : 'text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400'
          }`}
        >
          <Play size={20} className={isRunning ? 'fill-zinc-500' : 'fill-emerald-500'} />
        </button>
      </div>

      {/* Bottom Nav Items */}
      <div className="mt-auto flex flex-col space-y-3">
        <button
          onClick={() => setActiveView('about')}
          title="About Custom IDE"
          style={{
            backgroundColor: activeView === 'about' ? theme.activityBar.activeBg : 'transparent',
            color: activeView === 'about' ? theme.activityBar.activeText : theme.activityBar.inactiveText
          }}
          className={`p-2 rounded-lg transition-colors ${activeView !== 'about' ? theme.activityBar.hoverBg : ''}`}
        >
          <Info size={19} />
        </button>

        <button
          onClick={() => setActiveView('settings')}
          title="Settings"
          style={{
            backgroundColor: activeView === 'settings' ? theme.activityBar.activeBg : 'transparent',
            color: activeView === 'settings' ? theme.activityBar.activeText : theme.activityBar.inactiveText
          }}
          className={`p-2 rounded-lg transition-colors ${activeView !== 'settings' ? theme.activityBar.hoverBg : ''}`}
        >
          <Settings size={19} />
        </button>
      </div>
    </aside>
  );
}
