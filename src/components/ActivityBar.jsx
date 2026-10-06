import React from 'react';
import { Files, Terminal, Settings, Code2, Play, Info } from 'lucide-react';

export default function ActivityBar({ activeView, setActiveView, isTerminalOpen, setIsTerminalOpen, onRunCode, isRunning }) {
  return (
    <aside className="w-12 bg-[#141416] border-r border-[#27272a] flex flex-col items-center py-3 select-none z-20">
      {/* Brand Icon */}
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-6 shadow-md shadow-blue-500/20">
        <Code2 size={20} />
      </div>

      {/* Top Nav Items */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setActiveView('explorer')}
          title="Explorer (Files)"
          className={`p-2 rounded-lg transition-colors relative ${
            activeView === 'explorer'
              ? 'text-white bg-[#27272a]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023]'
          }`}
        >
          {activeView === 'explorer' && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
          )}
          <Files size={20} />
        </button>

        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          title="Toggle Integrated Terminal"
          className={`p-2 rounded-lg transition-colors relative ${
            isTerminalOpen
              ? 'text-blue-400 bg-[#27272a]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023]'
          }`}
        >
          <Terminal size={20} />
        </button>

        <button
          onClick={onRunCode}
          disabled={isRunning}
          title="Run Current File"
          className={`p-2 rounded-lg transition-all ${
            isRunning
              ? 'text-zinc-600 animate-pulse'
              : 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300'
          }`}
        >
          <Play size={20} className={isRunning ? 'fill-zinc-600' : 'fill-emerald-400'} />
        </button>
      </div>

      {/* Bottom Nav Items */}
      <div className="mt-auto flex flex-col space-y-3">
        <button
          onClick={() => setActiveView('about')}
          title="About Custom IDE"
          className={`p-2 rounded-lg transition-colors ${
            activeView === 'about'
              ? 'text-white bg-[#27272a]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023]'
          }`}
        >
          <Info size={19} />
        </button>

        <button
          onClick={() => setActiveView('settings')}
          title="Settings"
          className={`p-2 rounded-lg transition-colors ${
            activeView === 'settings'
              ? 'text-white bg-[#27272a]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023]'
          }`}
        >
          <Settings size={19} />
        </button>
      </div>
    </aside>
  );
}
