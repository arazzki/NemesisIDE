import React from 'react';
import { GitBranch, CheckCircle } from 'lucide-react';
import { getLanguageFromPath } from '../utils/languageHelper';
import { getTheme } from '../utils/themeHelper';

export default function StatusBar({
  activeFile,
  cursorPosition,
  serverStatus,
  tabSize = 2,
  saveStatus,
  theme: userTheme
}) {
  const theme = userTheme || getTheme('nemesis-dark');
  const currentLang = activeFile ? getLanguageFromPath(activeFile.path) : 'Plain Text';

  return (
    <footer 
      style={{ 
        backgroundColor: theme.statusBar.bg, 
        borderColor: theme.statusBar.border, 
        color: theme.statusBar.text 
      }}
      className="h-6 border-t flex items-center justify-between px-3 text-[11px] select-none z-20 transition-colors"
    >
      {/* Left info */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-1.5 font-medium ${theme.statusBar.branchColor}`}>
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
            <div className={`capitalize font-medium ${theme.statusBar.activeLangColor}`}>
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
          <span style={{ color: theme.statusBar.text }} className="text-[10px] opacity-80">
            {serverStatus === 'connected' ? 'Local Server' : 'Disconnected'}
          </span>
        </div>
      </div>
    </footer>
  );
}
