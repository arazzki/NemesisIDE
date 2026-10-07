import React, { useState } from 'react';
import { 
  GitBranch, Shield, XCircle, AlertTriangle, 
  Smile, Bell, CheckCircle
} from 'lucide-react';
import { getLanguageFromPath } from '../utils/languageHelper';

export default function StatusBar({
  activeFile,
  cursorPosition,
  serverStatus,
  tabSize = 2,
  saveStatus,
  onOpenLanguageSelect
}) {
  const [restrictedMode, setRestrictedMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentLang = activeFile ? getLanguageFromPath(activeFile.path) : 'Plain Text';

  // Format language display name
  const getLanguageTag = (lang) => {
    switch (lang.toLowerCase()) {
      case 'html': return '{ } HTML';
      case 'css': return '{ } CSS';
      case 'javascript': return '{ } JavaScript';
      case 'typescript': return '{ } TypeScript';
      case 'json': return '{ } JSON';
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      case 'c': return 'C';
      case 'markdown': return 'Markdown';
      default: return lang.toUpperCase();
    }
  };

  return (
    <footer className="h-[22px] min-h-[22px] bg-[#181818] border-t border-[#2b2b2b] flex items-center justify-between px-0 text-[11px] text-[#cccccc] select-none z-20 font-sans">
      {/* Left side items */}
      <div className="flex items-center h-full">
        {/* Blue Restricted Mode Badge (Exactly like in the VS Code screenshot!) */}
        <button
          onClick={() => setRestrictedMode(!restrictedMode)}
          title={restrictedMode ? 'Workspace Trust: Restricted Mode' : 'Workspace Trust: Trusted'}
          className={`h-full px-2 flex items-center space-x-1 font-medium transition-colors ${
            restrictedMode
              ? 'bg-[#007acc] text-white hover:bg-[#0062a3]'
              : 'hover:bg-[#2a2d2e] text-[#cccccc]'
          }`}
        >
          <Shield size={12} className="shrink-0" />
          <span className="text-[11px]">{restrictedMode ? 'Restricted Mode' : 'Trusted'}</span>
        </button>

        {/* Errors & Warnings (⊗ 0  ⚠ 0 - exactly like screenshot) */}
        <button
          title="Problems: 0 Errors, 0 Warnings"
          className="h-full px-2 hover:bg-[#2a2d2e] flex items-center space-x-2 text-[#cccccc] transition-colors"
        >
          <div className="flex items-center space-x-1">
            <XCircle size={12} className="text-[#858585]" />
            <span>0</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle size={12} className="text-[#858585]" />
            <span>0</span>
          </div>
        </button>

        {/* Git Branch */}
        <button
          title="Git Branch: main"
          className="h-full px-2 hover:bg-[#2a2d2e] flex items-center space-x-1 text-[#cccccc] transition-colors"
        >
          <GitBranch size={12} />
          <span>main</span>
        </button>

        {/* Save Status Notification */}
        {saveStatus && (
          <div className="flex items-center space-x-1 text-emerald-400 px-2 animate-in fade-in">
            <CheckCircle size={11} />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Right side items */}
      <div className="flex items-center h-full">
        {activeFile && (
          <>
            {/* Cursor Position (Ln 20, Col 9) */}
            <button
              title="Go to Line/Column"
              className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors"
            >
              Ln {cursorPosition.line}, Col {cursorPosition.col}
            </button>

            {/* Indentation (Spaces: 2) */}
            <button
              title="Select Indentation"
              className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors"
            >
              Spaces: {tabSize}
            </button>

            {/* Encoding (UTF-8) */}
            <button
              title="Select Encoding"
              className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors"
            >
              UTF-8
            </button>

            {/* End of Line (CRLF) */}
            <button
              title="Select End of Line Sequence"
              className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors"
            >
              CRLF
            </button>

            {/* Language Mode ({ } HTML) */}
            <button
              onClick={onOpenLanguageSelect}
              title="Select Language Mode"
              className="h-full px-2 hover:bg-[#2a2d2e] flex items-center space-x-1 text-[#cccccc] transition-colors font-medium"
            >
              <span>{getLanguageTag(currentLang)}</span>
            </button>
          </>
        )}

        {/* Feedback Smiley Icon (🙂) */}
        <button
          title="Tweet Feedback"
          className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors"
        >
          <Smile size={13} />
        </button>

        {/* Bell Notification Icon (🔔) */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          title="No Notifications"
          className="h-full px-2 hover:bg-[#2a2d2e] flex items-center text-[#cccccc] transition-colors relative"
        >
          <Bell size={13} />
        </button>

        {/* Local Server Connection Dot */}
        <div 
          className="h-full px-2 flex items-center space-x-1.5"
          title={`Nemesis Server: ${serverStatus}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              serverStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>
    </footer>
  );
}
