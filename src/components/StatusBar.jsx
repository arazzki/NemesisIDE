import React from 'react';
import { GitBranch, Radio, CheckCircle, AlertCircle } from 'lucide-react';
import { getLanguageFromPath } from '../utils/languageHelper';

export default function StatusBar({
  activeFile,
  cursorPosition,
  serverStatus,
  tabSize = 2,
  saveStatus
}) {
  const currentLang = activeFile ? getLanguageFromPath(activeFile.path) : 'Plain Text';

  return (
    <footer className="h-6 bg-[#18181b] border-t border-[#27272a] flex items-center justify-between px-3 text-[11px] text-zinc-400 select-none z-20">
      {/* Left info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-blue-400 font-medium">
          <GitBranch size={12} />
          <span>main</span>
        </div>

        {saveStatus && (
          <div className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle size={11} />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Right info */}
      <div className="flex items-center space-x-4">
        {activeFile && (
          <>
            <div>
              Ln {cursorPosition.line}, Col {cursorPosition.col}
            </div>
            <div>
              Spaces: {tabSize}
            </div>
            <div>UTF-8</div>
            <div className="capitalize text-zinc-300 font-medium">
              {currentLang}
            </div>
          </>
        )}

        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              serverStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="text-zinc-500 text-[10px]">
            {serverStatus === 'connected' ? 'Local Server' : 'Disconnected'}
          </span>
        </div>
      </div>
    </footer>
  );
}
