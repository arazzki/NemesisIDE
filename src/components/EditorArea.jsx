import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Save, Code, FolderOpen } from 'lucide-react';
import { getLanguageFromPath, getFileBadgeColor, getLanguageName } from '../utils/languageHelper';
import { registerAllSnippets } from '../utils/snippets';
import { getTheme } from '../utils/themeHelper';

export default function EditorArea({
  tabs,
  activeTabPath,
  workspaceInfo,
  onOpenFolder,
  onSelectTab,
  onCloseTab,
  onContentChange,
  onSaveFile,
  onRunCode,
  isRunning,
  editorSettings,
  onCursorChange,
  theme: userTheme
}) {
  const theme = userTheme || getTheme(editorSettings.theme);
  const activeTab = tabs.find((t) => t.path === activeTabPath);
  const editorRef = useRef(null);

  // Setup vibrant custom themes before Monaco mounts
  const handleEditorWillMount = (monaco) => {
    // Theme 1: Nemesis Dark (One Dark Pro inspired)
    monaco.editor.defineTheme('nemesis-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'type', foreground: 'e5c07b', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: 'e5c07b' },
        { token: 'class', foreground: 'e5c07b', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'abb2bf' },
        { token: 'function', foreground: '61afef', fontStyle: 'bold' },
        { token: 'method', foreground: '61afef' },
        { token: 'string', foreground: '98c379' },
        { token: 'string.escape', foreground: '56b6c2' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'delimiter', foreground: '56b6c2' },
        { token: 'operator', foreground: '56b6c2' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'attribute.name', foreground: 'd19a66' },
        { token: 'attribute.value', foreground: '98c379' },
        { token: 'variable', foreground: 'e06c75' },
        { token: 'variable.parameter', foreground: 'd19a66' },
        { token: 'constant', foreground: 'd19a66', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#1a1a1f',
        'editor.foreground': '#abb2bf',
        'editorCursor.foreground': '#528bff',
        'editor.lineHighlightBackground': '#24242d',
        'editorLineNumber.foreground': '#4b5263',
        'editorLineNumber.activeForeground': '#abb2bf',
        'editor.selectionBackground': '#3e4451',
        'editor.inactiveSelectionBackground': '#2c313a',
        'editorIndentGuide.background': '#2d3139',
        'editorIndentGuide.activeBackground': '#4e5666',
        'editorBracketMatch.background': '#515a6b',
        'editorBracketMatch.border': '#515a6b',
      }
    });

    // Theme 2: Tokyo Night (Neon Cyberpunk)
    monaco.editor.defineTheme('tokyo-night', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'bb9af7', fontStyle: 'bold' },
        { token: 'type', foreground: '2ac3de', fontStyle: 'bold' },
        { token: 'function', foreground: '7aa2f7', fontStyle: 'bold' },
        { token: 'string', foreground: '9ece6a' },
        { token: 'number', foreground: 'ff9e64' },
        { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
        { token: 'delimiter', foreground: '89ddff' },
        { token: 'operator', foreground: '89ddff' },
        { token: 'variable', foreground: 'f7768e' },
      ],
      colors: {
        'editor.background': '#16161e',
        'editor.foreground': '#a9b1d6',
        'editor.lineHighlightBackground': '#1f2335',
        'editorLineNumber.foreground': '#3b4261',
        'editorLineNumber.activeForeground': '#7aa2f7',
        'editor.selectionBackground': '#283457',
      }
    });

    // Theme 3: Light (Modern Crisp Light)
    monaco.editor.defineTheme('light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'd73a49', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'd73a49', fontStyle: 'bold' },
        { token: 'type', foreground: '6f42c1', fontStyle: 'bold' },
        { token: 'class', foreground: '6f42c1', fontStyle: 'bold' },
        { token: 'function', foreground: '005cc5', fontStyle: 'bold' },
        { token: 'method', foreground: '005cc5' },
        { token: 'string', foreground: '22863a' },
        { token: 'number', foreground: '005cc5' },
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'variable', foreground: '24292e' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorCursor.foreground': '#0366d6',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorLineNumber.foreground': '#8c959f',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.selectionBackground': '#b3d7ff',
        'editor.inactiveSelectionBackground': '#e1e4e8',
        'editorIndentGuide.background': '#d0d7de',
        'editorIndentGuide.activeBackground': '#57606a',
      }
    });

    // Register all default code snippets (sout + tab, clg + tab, pr + tab, etc.)
    registerAllSnippets(monaco);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor changes for Status Bar
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });

    // Add Ctrl+S / Cmd+S save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveFile();
    });
  };

  return (
    <div 
      style={{ backgroundColor: theme.editor.bg }} 
      className="flex-1 flex flex-col h-full overflow-hidden transition-colors"
    >
      {/* Tab Bar & Action Buttons Header */}
      <div 
        style={{ 
          backgroundColor: theme.tabBar.bg, 
          borderColor: theme.tabBar.border 
        }} 
        className="flex items-center justify-between border-b h-9 select-none transition-colors"
      >
        {/* Open Tabs */}
        <div className="flex items-center h-full overflow-x-auto no-scrollbar flex-1">
          {tabs.map((tab) => {
            const isActive = tab.path === activeTabPath;
            const badgeClasses = getFileBadgeColor(tab.path).split(' ');
            const dotBg = badgeClasses[1] || 'bg-blue-400';

            return (
              <div
                key={tab.path}
                onClick={() => onSelectTab(tab.path)}
                style={{
                  backgroundColor: isActive ? theme.tabBar.activeTabBg : theme.tabBar.inactiveTabBg,
                  color: isActive ? theme.tabBar.activeTabText : theme.tabBar.inactiveTabText,
                  borderTop: isActive ? `2px solid ${theme.tabBar.activeTabBorder}` : '2px solid transparent',
                  borderRight: `1px solid ${theme.tabBar.border}`
                }}
                className={`group flex items-center h-full px-3 text-xs cursor-pointer transition-colors max-w-xs ${
                  isActive ? 'font-medium' : theme.tabBar.inactiveTabHover
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${dotBg}`} />
                <span className="truncate mr-2">{tab.name}</span>

                {/* Dirty indicator or close button */}
                <div className="flex items-center">
                  {tab.isDirty && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:hidden mr-1" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.path);
                    }}
                    className={`p-0.5 rounded hover:bg-zinc-500/20 opacity-70 hover:opacity-100 ${
                      tab.isDirty ? 'hidden group-hover:block' : ''
                    }`}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons (Save & Run) */}
        {activeTab && (
          <div 
            style={{ 
              backgroundColor: theme.tabBar.actionAreaBg, 
              borderLeft: `1px solid ${theme.tabBar.actionAreaBorder}` 
            }} 
            className="flex items-center space-x-2 px-3 h-full transition-colors"
          >
            <span 
              style={{ color: theme.isLight ? '#4b5563' : '#a1a1aa' }} 
              className="text-[11px] font-mono hidden md:inline mr-1"
            >
              {getLanguageName(activeTab.path)}
            </span>

            <button
              onClick={() => onSaveFile()}
              disabled={!activeTab.isDirty}
              title="Simpan File (Ctrl + S)"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab.isDirty
                  ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-500 cursor-default opacity-60'
              }`}
            >
              <Save size={13} />
              <span>Simpan</span>
            </button>

            <button
              onClick={onRunCode}
              disabled={isRunning}
              title={`Jalankan ${getLanguageName(activeTab.path)} (Run)`}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all ${
                isRunning
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/30'
              }`}
            >
              <Play size={13} className="fill-white" />
              <span>{isRunning ? 'Berjalan...' : 'Run Code'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Main Content or Welcome Screen */}
      <div className="flex-1 relative">
        {activeTab ? (
          <Editor
            height="100%"
            path={activeTab.path}
            defaultLanguage={getLanguageFromPath(activeTab.path)}
            language={getLanguageFromPath(activeTab.path)}
            value={activeTab.content}
            theme={editorSettings.theme}
            beforeMount={handleEditorWillMount}
            onChange={(newVal) => onContentChange(activeTab.path, newVal ?? '')}
            onMount={handleEditorDidMount}
            options={{
              fontSize: editorSettings.fontSize,
              tabSize: editorSettings.tabSize,
              wordWrap: editorSettings.wordWrap,
              minimap: { enabled: editorSettings.minimap },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              formatOnPaste: true,
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              tabCompletion: 'on',
              snippetSuggestions: 'top',
              quickSuggestions: { other: true, comments: false, strings: false },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
            }}
          />
        ) : (
          /* Empty / Welcome State */
          <div 
            style={{ 
              backgroundColor: theme.editor.emptyBg, 
              color: theme.editor.emptyText 
            }} 
            className="h-full flex flex-col items-center justify-center select-none p-6 transition-colors"
          >
            <div className="flex flex-col items-center mb-3">
              <img 
                src="/banner.png" 
                alt="Nemesis IDE" 
                className="w-72 h-auto object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(168,85,247,0.25)]" 
              />
            </div>
            <p 
              style={{ color: theme.editor.emptyMuted }} 
              className="text-xs mb-5 text-center max-w-sm"
            >
              Tarik & lepaskan (Drag & drop) folder dari Desktop ke sini, atau klik tombol di bawah untuk membuka project.
            </p>

            <button
              onClick={() => onOpenFolder && onOpenFolder()}
              className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all hover:scale-105"
            >
              <FolderOpen size={15} className="text-amber-300" />
              <span>Buka Folder dari Desktop / PC</span>
              <kbd className="bg-white/20 text-blue-100 text-[10px] px-1.5 py-0.5 rounded font-mono ml-1.5">Ctrl+O</kbd>
            </button>

            <div 
              style={{ 
                backgroundColor: theme.editor.shortcutBadgeBg, 
                borderColor: theme.editor.shortcutBadgeBorder 
              }} 
              className="border rounded-lg p-4 w-72 text-xs space-y-2.5 shadow-sm"
            >
              <div className="flex justify-between items-center" style={{ color: theme.editor.emptyText }}>
                <span>Buka Folder Project</span>
                <kbd 
                  style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#2563eb' : '#93c5fd' }} 
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                >
                  Ctrl + O
                </kbd>
              </div>
              <div className="flex justify-between items-center" style={{ color: theme.editor.emptyText }}>
                <span>Code Snippet</span>
                <kbd 
                  style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#2563eb' : '#93c5fd' }} 
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                >
                  sout, clg, pr + Tab
                </kbd>
              </div>
              <div className="flex justify-between items-center" style={{ color: theme.editor.emptyText }}>
                <span>Simpan File</span>
                <kbd 
                  style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                >
                  Ctrl + S
                </kbd>
              </div>
              <div className="flex justify-between items-center" style={{ color: theme.editor.emptyText }}>
                <span>Jalankan Script</span>
                <kbd 
                  style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                >
                  Tombol Run
                </kbd>
              </div>
              <div className="flex justify-between items-center" style={{ color: theme.editor.emptyText }}>
                <span>Toggle Terminal</span>
                <kbd 
                  style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                >
                  Panel Bawah
                </kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
