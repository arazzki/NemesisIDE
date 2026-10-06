import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Save, Code, FileQuestion } from 'lucide-react';
import { getLanguageFromPath, getFileBadgeColor } from '../utils/languageHelper';

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
            const badgeColor = getFileBadgeColor(tab.path);

            return (
              <div
                key={tab.path}
                onClick={() => onSelectTab(tab.path)}
                className={`group flex items-center h-full px-3 text-xs border-r border-[#27272a] cursor-pointer transition-colors max-w-xs ${
                  isActive
                    ? 'bg-[#1e1e24] text-white border-t-2 border-t-blue-500 font-medium'
                    : 'bg-[#141416] text-zinc-400 hover:bg-[#1b1b1e] hover:text-zinc-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${badgeColor.replace('text-', 'bg-')}`} />
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
              title="Jalankan Kode (Run)"
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
              Custom IDE berbasis Monaco Editor dan Node.js Backend. Pilih file dari sidebar untuk mulai mengedit kode.
            </p>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 w-72 text-xs space-y-2.5">
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
