import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Save, Code } from 'lucide-react';
import { getLanguageFromPath, getFileBadgeColor, getLanguageName } from '../utils/languageHelper';
import { registerAllSnippets } from '../utils/snippets';

export default function EditorArea({
  tabs,
  activeTabPath,
  onSelectTab,
  onCloseTab,
  onContentChange,
  onSaveFile,
  onRunCode,
  isRunning,
  editorSettings,
  onCursorChange
}) {
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
    <div className="flex-1 flex flex-col h-full bg-[#1e1e24] overflow-hidden">
      {/* Tab Bar & Action Buttons Header */}
      <div className="flex items-center justify-between bg-[#141416] border-b border-[#27272a] h-9 select-none">
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
                className={`group flex items-center h-full px-3 text-xs border-r border-[#27272a] cursor-pointer transition-colors max-w-xs ${
                  isActive
                    ? 'bg-[#1a1a1f] text-white border-t-2 border-t-blue-500 font-medium'
                    : 'bg-[#141416] text-zinc-400 hover:bg-[#1b1b1e] hover:text-zinc-200'
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
                    className={`p-0.5 rounded hover:bg-[#3f3f46] text-zinc-400 hover:text-white ${
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
          <div className="flex items-center space-x-2 px-3 border-l border-[#27272a] bg-[#141416] h-full">
            <span className="text-[11px] text-zinc-400 font-mono hidden md:inline mr-1">
              {getLanguageName(activeTab.path)}
            </span>

            <button
              onClick={() => onSaveFile()}
              disabled={!activeTab.isDirty}
              title="Simpan File (Ctrl + S)"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab.isDirty
                  ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-500 cursor-default'
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
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 select-none p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/20">
              <Code size={36} />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Nemesis IDE</h2>
            <p className="text-xs text-zinc-400 mb-6 text-center max-w-sm">
              Custom IDE dengan pewarnaan sintaks kaya warna untuk Python, Java, JavaScript, Dart, C++, C#, Go, Rust, dan lainnya.
            </p>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 w-72 text-xs space-y-2.5">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Code Snippet</span>
                <kbd className="bg-[#27272a] text-blue-300 px-1.5 py-0.5 rounded text-[11px] font-mono">sout, clg, pr + Tab</kbd>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Simpan File</span>
                <kbd className="bg-[#27272a] text-zinc-200 px-1.5 py-0.5 rounded text-[11px] font-mono">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Jalankan Script</span>
                <kbd className="bg-[#27272a] text-zinc-200 px-1.5 py-0.5 rounded text-[11px] font-mono">Tombol Run</kbd>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Toggle Terminal</span>
                <kbd className="bg-[#27272a] text-zinc-200 px-1.5 py-0.5 rounded text-[11px] font-mono">Panel Bawah</kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
