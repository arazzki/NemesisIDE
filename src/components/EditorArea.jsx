import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Save, Columns2, MoreHorizontal, FolderOpen } from 'lucide-react';
import { getLanguageFromPath, getLanguageName } from '../utils/languageHelper';
import { registerAllSnippets } from '../utils/snippets';
import FileIcon from './FileIcon';
import Breadcrumbs from './Breadcrumbs';

const EditorArea = forwardRef(function EditorArea({
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
  cursorPosition,
  onCursorChange
}, ref) {
  const activeTab = tabs.find((t) => t.path === activeTabPath);
  const editorRef = useRef(null);

  // Expose jump to line method
  useImperativeHandle(ref, () => ({
    revealLine: (lineNumber) => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(lineNumber);
        editorRef.current.setPosition({ lineNumber, column: 1 });
        editorRef.current.focus();
      }
    }
  }));

  // Define themes including official VS Code Dark Modern
  const handleEditorWillMount = (monaco) => {
    // Theme 1: VS Code Dark Modern (Default in modern VS Code)
    monaco.editor.defineTheme('vs-dark-modern', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6' },
        { token: 'keyword.control', foreground: 'c586c0' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'type.identifier', foreground: '4ec9b0' },
        { token: 'class', foreground: '4ec9b0' },
        { token: 'identifier', foreground: '9cdcfe' },
        { token: 'function', foreground: 'dcdcaa' },
        { token: 'method', foreground: 'dcdcaa' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'string.escape', foreground: 'd7ba7d' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'delimiter', foreground: 'cccccc' },
        { token: 'operator', foreground: 'd4d4d4' },
        { token: 'tag', foreground: '569cd6' },
        { token: 'tag.id', foreground: '9cdcfe' },
        { token: 'tag.class', foreground: '9cdcfe' },
        { token: 'attribute.name', foreground: '9cdcfe' },
        { token: 'attribute.value', foreground: 'ce9178' },
        { token: 'variable', foreground: '9cdcfe' },
        { token: 'variable.parameter', foreground: '9cdcfe' },
        { token: 'constant', foreground: '4fc1ff' },
      ],
      colors: {
        'editor.background': '#1f1f1f',
        'editor.foreground': '#cccccc',
        'editorCursor.foreground': '#aeafad',
        'editor.lineHighlightBackground': '#282828',
        'editor.lineHighlightBorder': '#28282800',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#cccccc',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorBracketMatch.background': '#0064a7',
        'editorBracketMatch.border': '#0064a7',
      }
    });

    // Theme 2: Nemesis Dark (One Dark Pro)
    monaco.editor.defineTheme('nemesis-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'type', foreground: 'e5c07b', fontStyle: 'bold' },
        { token: 'function', foreground: '61afef', fontStyle: 'bold' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'attribute.name', foreground: 'd19a66' },
      ],
      colors: {
        'editor.background': '#1a1a1f',
        'editor.foreground': '#abb2bf',
        'editorCursor.foreground': '#528bff',
        'editor.lineHighlightBackground': '#24242d',
        'editorLineNumber.foreground': '#4b5263',
        'editorLineNumber.activeForeground': '#abb2bf',
        'editor.selectionBackground': '#3e4451',
      }
    });

    // Theme 3: Tokyo Night
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

    registerAllSnippets(monaco);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveFile();
    });
  };

  const handleJumpToLine = (lineNumber) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1f1f1f] overflow-hidden">
      {/* VS Code Tab Bar & Controls */}
      <div className="flex items-center justify-between bg-[#181818] border-b border-[#2b2b2b] h-[35px] select-none">
        {/* Open Tabs */}
        <div className="flex items-center h-full overflow-x-auto no-scrollbar flex-1">
          {tabs.map((tab) => {
            const isActive = tab.path === activeTabPath;

            return (
              <div
                key={tab.path}
                onClick={() => onSelectTab(tab.path)}
                className={`group flex items-center h-full px-3 text-[12px] border-r border-[#262626] cursor-pointer transition-colors max-w-xs relative ${
                  isActive
                    ? 'bg-[#1f1f1f] text-white border-t-2 border-t-[#007acc] font-medium'
                    : 'bg-[#181818] text-[#9d9d9d] hover:bg-[#1f1f1f]/60 hover:text-[#cccccc]'
                }`}
              >
                {/* File Icon */}
                <span className="mr-2 flex items-center">
                  <FileIcon filename={tab.name} size={15} />
                </span>

                <span className="truncate mr-2">{tab.name}</span>

                {/* Close Button or Dirty Indicator Dot */}
                <div className="flex items-center ml-auto">
                  {tab.isDirty && (
                    <span 
                      className={`w-2 h-2 rounded-full bg-white mr-1 group-hover:hidden`} 
                      title="File belum disimpan"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.path);
                    }}
                    title="Close (Ctrl+W)"
                    className={`p-0.5 rounded hover:bg-[#3f3f46] text-[#858585] hover:text-white ${
                      tab.isDirty ? 'hidden group-hover:block' : 'opacity-0 group-hover:opacity-100'
                    } ${isActive ? 'opacity-100' : ''}`}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Right Actions: Run Code, Split Editor, More */}
        {activeTab && (
          <div className="flex items-center space-x-1 px-2 bg-[#181818] h-full shrink-0">
            {/* Play / Run Button */}
            <button
              onClick={onRunCode}
              disabled={isRunning}
              title={`Jalankan ${getLanguageName(activeTab.path)} (F5)`}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all ${
                isRunning
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-emerald-400 hover:bg-[#2a2a2a] hover:text-emerald-300'
              }`}
            >
              <Play size={13} className={isRunning ? 'fill-zinc-600' : 'fill-emerald-400'} />
            </button>

            {/* Split Editor */}
            <button
              title="Split Editor Right"
              className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <Columns2 size={14} />
            </button>

            {/* More Actions */}
            <button
              title="More Actions..."
              className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        )}
      </div>

      {/* VS Code Breadcrumbs Bar (Directly below tab bar) */}
      {activeTab && (
        <Breadcrumbs
          activeFile={activeTab}
          cursorPosition={cursorPosition}
          onNavigateLine={handleJumpToLine}
        />
      )}

      {/* Editor Content or Empty Welcome */}
      <div className="flex-1 relative">
        {activeTab ? (
          <Editor
            height="100%"
            path={activeTab.path}
            defaultLanguage={getLanguageFromPath(activeTab.path)}
            language={getLanguageFromPath(activeTab.path)}
            value={activeTab.content}
            theme={editorSettings.theme || 'vs-dark-modern'}
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
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true
            }}
          />
        ) : (
          /* Empty / Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 select-none p-6">
            <div className="flex flex-col items-center mb-3">
              <img 
                src="/banner.png" 
                alt="Nemesis IDE" 
                className="w-72 h-auto object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(168,85,247,0.25)]" 
              />
            </div>
            <p className="text-xs text-zinc-400 mb-5 text-center max-w-sm">
              Tarik & lepaskan folder dari Desktop ke sini, atau klik tombol di bawah untuk membuka project.
            </p>

            <button
              onClick={() => onOpenFolder && onOpenFolder()}
              className="mb-6 flex items-center space-x-2 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-semibold px-4 py-2 rounded shadow-md transition-all"
            >
              <FolderOpen size={15} />
              <span>Buka Folder Project</span>
              <kbd className="bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded font-mono ml-1.5">Ctrl+O</kbd>
            </button>

            <div className="bg-[#18181b] border border-[#2b2b2b] rounded p-4 w-72 text-xs space-y-2">
              <div className="flex justify-between items-center text-[#858585]">
                <span>Show All Commands</span>
                <kbd className="bg-[#2a2a2a] text-[#cccccc] px-1.5 py-0.5 rounded text-[11px] font-mono">Ctrl + Shift + P</kbd>
              </div>
              <div className="flex justify-between items-center text-[#858585]">
                <span>Go to File</span>
                <kbd className="bg-[#2a2a2a] text-[#cccccc] px-1.5 py-0.5 rounded text-[11px] font-mono">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between items-center text-[#858585]">
                <span>Toggle Terminal</span>
                <kbd className="bg-[#2a2a2a] text-[#cccccc] px-1.5 py-0.5 rounded text-[11px] font-mono">Ctrl + `</kbd>
              </div>
              <div className="flex justify-between items-center text-[#858585]">
                <span>Toggle Primary Side Bar</span>
                <kbd className="bg-[#2a2a2a] text-[#cccccc] px-1.5 py-0.5 rounded text-[11px] font-mono">Ctrl + B</kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default EditorArea;
