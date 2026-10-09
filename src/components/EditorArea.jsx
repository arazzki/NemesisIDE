import React, { useRef, useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { 
  X, Play, Save, Code, FolderOpen, Sparkles, Globe, 
  Monitor, Tablet, Smartphone, RotateCw, ExternalLink, FilePlus 
} from 'lucide-react';
import { getLanguageFromPath, getFileBadgeColor, getLanguageName } from '../utils/languageHelper';
import { registerAllSnippets } from '../utils/snippets';
import { registerHtmlCompletions, setupHtmlAutoCloseAndQuotes } from '../utils/htmlHelper';
import { getTheme } from '../utils/themeHelper';

export default function EditorArea({
  tabs,
  activeTabPath,
  workspaceInfo,
  onOpenFolder,
  onCreateItem,
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
  const splitAreaRef = useRef(null);

  // Quick file creation in empty board state
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Live Web Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSplitRatio, setPreviewSplitRatio] = useState(50);
  const [previewDevice, setPreviewDevice] = useState('responsive'); // 'responsive' | 'tablet' | 'mobile'
  const [debouncedContent, setDebouncedContent] = useState('');
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const isHtml = Boolean(activeTab && /\.(html?|svg)$/i.test(activeTab.path));

  // Debounce active tab content update for Live Preview (smooth typing)
  useEffect(() => {
    if (!activeTab) return;
    const timer = setTimeout(() => {
      setDebouncedContent(activeTab.content || '');
    }, 250);
    return () => clearTimeout(timer);
  }, [activeTab?.content]);

  // Handle draggable split resize between Editor and Live Preview
  const handleSplitMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSplit || !splitAreaRef.current) return;
      const rect = splitAreaRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 20 && newRatio <= 80) {
        setPreviewSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit]);

  // Build preview HTML with base tag for workspace asset resolution
  const previewHtml = useMemo(() => {
    if (!activeTab) return '';
    let html = debouncedContent || '';

    // Inject <base href="/workspace-preview/"> so relative links (CSS, JS, images) resolve via workspace
    const baseTag = '<base href="/workspace-preview/">';
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, `$&${baseTag}`);
    } else if (/<html[^>]*>/i.test(html)) {
      html = html.replace(/<html[^>]*>/i, `$&<head>${baseTag}</head>`);
    } else {
      html = `${baseTag}${html}`;
    }
    return html;
  }, [debouncedContent, activeTab?.path]);

  // Format document action (Shift + Alt + F)
  const handleFormatDocument = async () => {
    if (!editorRef.current) return null;
    try {
      const action = editorRef.current.getAction('editor.action.formatDocument');
      if (action) {
        await action.run();
      }
    } catch (err) {
      console.warn('[FormatDocument] Failed:', err);
    }
    return editorRef.current ? editorRef.current.getValue() : null;
  };

  // Save handler with format on save check
  const handleSave = async () => {
    if (!activeTab) return;
    let formattedContent = null;
    if (editorSettings?.formatOnSave && editorRef.current) {
      formattedContent = await handleFormatDocument();
    }
    onSaveFile(activeTab.path, formattedContent);
  };

  // Setup custom themes & formatters before Monaco mounts
  const handleEditorWillMount = (monaco) => {
    // HTML formatting defaults
    if (monaco.languages && monaco.languages.html) {
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: editorSettings.tabSize || 2,
          insertSpaces: true,
          wrapLineLength: 120,
          unformatted: 'wbr',
          contentUnformatted: 'pre,code,textarea',
          indentInnerHtml: true,
          preserveNewLines: true,
          maxPreserveNewLines: 2,
          indentHandlebars: false,
          endWithNewline: false,
          extraLiners: 'head, body, /html',
          wrapAttributes: 'auto'
        }
      });
    }

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

    // Register rich HTML tag & attribute completion providers
    registerHtmlCompletions(monaco);
  };

  // Always keep latest refs to avoid stale closures in Monaco addCommand
  const handleSaveRef = useRef();
  handleSaveRef.current = handleSave;

  const handleFormatDocumentRef = useRef();
  handleFormatDocumentRef.current = handleFormatDocument;

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Enable HTML Auto-Close Tag on '>' and Auto-Quote on '='
    setupHtmlAutoCloseAndQuotes(editor, monaco);

    // Track cursor changes for Status Bar
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });

    // Add Ctrl+S / Cmd+S save shortcut (with auto-formatting)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (handleSaveRef.current) {
        handleSaveRef.current();
      }
    });

    // Add Shift+Alt+F format shortcut
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      () => {
        if (handleFormatDocumentRef.current) {
          handleFormatDocumentRef.current();
        }
      }
    );
  };

  return (
    <div 
      style={{ backgroundColor: theme.editor.bg }} 
      className="flex-1 min-h-0 flex flex-col h-full overflow-hidden transition-colors"
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

        {/* Action Buttons (Format, Live Preview, Save, Run) */}
        {activeTab && (
          <div 
            style={{ 
              backgroundColor: theme.tabBar.actionAreaBg, 
              borderLeft: `1px solid ${theme.tabBar.actionAreaBorder}` 
            }} 
            className="flex items-center space-x-1.5 px-3 h-full transition-colors"
          >
            <span 
              style={{ color: theme.isLight ? '#4b5563' : '#a1a1aa' }} 
              className="text-[11px] font-mono hidden md:inline mr-1"
            >
              {getLanguageName(activeTab.path)}
            </span>

            {/* Format Document Button */}
            <button
              onClick={handleFormatDocument}
              title="Format Dokumen (Shift + Alt + F)"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors ${
                theme.isLight
                  ? 'hover:bg-zinc-200 text-zinc-700'
                  : 'hover:bg-zinc-700/60 text-zinc-300 hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-amber-400" />
              <span className="hidden sm:inline">Format</span>
            </button>

            {/* Live Web Preview Toggle (HTML / SVG) */}
            {isHtml && (
              <button
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                title={isPreviewOpen ? "Tutup Live Preview" : "Buka Live Web Preview di Editor"}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isPreviewOpen
                    ? 'bg-blue-600 text-white shadow-sm'
                    : theme.isLight
                      ? 'hover:bg-zinc-200 text-zinc-700'
                      : 'hover:bg-zinc-700/60 text-zinc-300 hover:text-white'
                }`}
              >
                <Globe size={13} className={isPreviewOpen ? 'text-white' : 'text-blue-400'} />
                <span className="hidden sm:inline">{isPreviewOpen ? 'Tutup Preview' : 'Live Preview'}</span>
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
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

            {/* Run Code Button */}
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
      <div ref={splitAreaRef} className="flex-1 min-h-0 relative overflow-hidden">
        {activeTab ? (
          <div className="flex h-full w-full overflow-hidden">
            {/* Left Panel: Monaco Editor */}
            <div 
              style={{ 
                width: isPreviewOpen && isHtml ? `${previewSplitRatio}%` : '100%' 
              }} 
              className="h-full relative overflow-hidden"
            >
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
                  formatOnType: true,
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  autoClosingOvertype: 'always',
                  bracketPairColorization: { enabled: true },
                  automaticLayout: true,
                  fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
                  fontLigatures: true,
                  scrollBeyondLastLine: false,
                  tabCompletion: 'on',
                  snippetSuggestions: 'top',
                  quickSuggestions: { other: true, comments: false, strings: true },
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                }}
              />
            </div>

            {/* Draggable Divider */}
            {isPreviewOpen && isHtml && (
              <div
                onMouseDown={handleSplitMouseDown}
                style={{
                  backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a'
                }}
                className={`w-1.5 hover:w-2 select-none cursor-col-resize flex items-center justify-center transition-all z-20 shrink-0 ${
                  isDraggingSplit ? '!bg-blue-500 !w-2' : 'hover:bg-blue-500'
                }`}
                title="Geser untuk mengatur perbandingan layar editor & preview"
              >
                <div className="w-0.5 h-6 bg-zinc-400/50 rounded" />
              </div>
            )}

            {/* Right Panel: Live Web Preview */}
            {isPreviewOpen && isHtml && (
              <div 
                style={{ 
                  width: `${100 - previewSplitRatio}%`,
                  backgroundColor: theme.tabBar.bg,
                  borderColor: theme.tabBar.border 
                }} 
                className="h-full flex flex-col border-l overflow-hidden transition-colors"
              >
                {/* Preview Toolbar */}
                <div 
                  style={{ 
                    backgroundColor: theme.tabBar.actionAreaBg,
                    borderColor: theme.tabBar.border 
                  }}
                  className="h-9 min-h-[36px] border-b flex items-center justify-between px-3 select-none text-xs"
                >
                  {/* Left: Live Indicator */}
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span 
                      style={{ color: theme.header.text }} 
                      className="text-[11px] font-bold tracking-wide flex items-center space-x-1"
                    >
                      <span>LIVE PREVIEW</span>
                    </span>
                  </div>

                  {/* Center: Device Switchers */}
                  <div className="flex items-center space-x-1 bg-black/10 dark:bg-white/5 p-0.5 rounded border border-white/5">
                    <button
                      onClick={() => setPreviewDevice('responsive')}
                      title="Mode Responsif (100% Lebar)"
                      className={`p-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                        previewDevice === 'responsive'
                          ? 'bg-blue-600 text-white font-medium shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Monitor size={12} />
                      <span className="text-[10px] hidden md:inline">100%</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      title="Mode Tablet (768px)"
                      className={`p-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                        previewDevice === 'tablet'
                          ? 'bg-blue-600 text-white font-medium shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Tablet size={12} />
                      <span className="text-[10px] hidden md:inline">Tablet</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      title="Mode Mobile (375px)"
                      className={`p-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                        previewDevice === 'mobile'
                          ? 'bg-blue-600 text-white font-medium shadow-xs'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Smartphone size={12} />
                      <span className="text-[10px] hidden md:inline">Mobile</span>
                    </button>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewRefreshKey((k) => k + 1)}
                      title="Muat Ulang Preview (Reload)"
                      className="p-1 rounded hover:bg-zinc-500/20 opacity-70 hover:opacity-100 transition-colors"
                    >
                      <RotateCw size={12} />
                    </button>

                    <button
                      onClick={onRunCode}
                      title="Buka di Browser Eksternal (Default Browser)"
                      className="p-1 rounded hover:bg-zinc-500/20 opacity-70 hover:opacity-100 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </button>

                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      title="Tutup Preview"
                      className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 opacity-70 hover:opacity-100 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Preview Frame Body */}
                <div 
                  style={{
                    backgroundColor: theme.isLight ? '#f3f4f6' : '#111116'
                  }}
                  className="flex-1 overflow-auto flex items-center justify-center p-3 relative"
                >
                  <div 
                    className={`h-full transition-all duration-200 flex flex-col bg-white overflow-hidden ${
                      previewDevice === 'mobile'
                        ? 'w-[375px] max-w-full shadow-2xl rounded-2xl border-4 border-zinc-700/80 ring-1 ring-black/10'
                        : previewDevice === 'tablet'
                          ? 'w-[768px] max-w-full shadow-2xl rounded-xl border-4 border-zinc-700/80 ring-1 ring-black/10'
                          : 'w-full shadow-none rounded-none border-none'
                    }`}
                  >
                    <iframe
                      key={previewRefreshKey}
                      srcDoc={previewHtml}
                      title="Nemesis Live Web Preview"
                      sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                      className={`w-full h-full border-none bg-white ${
                        isDraggingSplit ? 'pointer-events-none select-none' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Welcome State */
          <div 
            style={{ 
              backgroundColor: theme.editor.emptyBg, 
              color: theme.editor.emptyText 
            }} 
            className="h-full w-full overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 sm:p-6 select-none transition-colors"
          >
            <div className="my-auto flex flex-col items-center w-full max-w-md text-center py-2 shrink-0">
              {/* Circular Emblem Logo */}
              <div className="relative mb-3 flex items-center justify-center">
                <div 
                  style={{
                    boxShadow: theme.isLight 
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
                      : '0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.15)'
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer bg-zinc-900/40"
                  title="Nemesis IDE"
                >
                  <img 
                    src="/emblem.png" 
                    alt="Nemesis IDE" 
                    className="w-full h-full object-contain rounded-full" 
                  />
                </div>
              </div>

              {/* Title & Workspace Information */}
              <h2 
                style={{ color: theme.editor.emptyText }} 
                className="text-base sm:text-lg font-bold tracking-tight mb-1"
              >
                Nemesis IDE
              </h2>

              {workspaceInfo?.name ? (
                <>
                  <div 
                    title={workspaceInfo.path || workspaceInfo.name}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium mb-2.5 border max-w-sm truncate shadow-xs transition-colors ${
                      theme.isLight
                        ? 'bg-blue-50/90 text-blue-700 border-blue-200'
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    <FolderOpen size={13} className="text-amber-500 shrink-0" />
                    <span className="truncate">
                      Folder aktif:{' '}
                      <span 
                        style={{ color: theme.isLight ? '#1e3a8a' : '#ffffff' }}
                        className="font-bold ml-0.5"
                      >
                        {workspaceInfo.name}
                      </span>
                    </span>
                  </div>
                  <p 
                    style={{ color: theme.editor.emptyMuted }} 
                    className="text-xs mb-3.5 text-center max-w-sm"
                  >
                    Pilih file di panel Explorer sebelah kiri untuk mulai coding, atau gunakan aksi di bawah.
                  </p>
                </>
              ) : (
                <p 
                  style={{ color: theme.editor.emptyMuted }} 
                  className="text-xs mb-3.5 text-center max-w-sm"
                >
                  Tarik & lepaskan folder ke sini, atau klik tombol di bawah untuk membuka project.
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                {workspaceInfo?.name && onCreateItem && !showNewFileInput && (
                  <button
                    onClick={() => setShowNewFileInput(true)}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all hover:scale-105"
                  >
                    <FilePlus size={13} className="text-blue-200" />
                    <span>Buat File Baru</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenFolder && onOpenFolder()}
                  style={{
                    backgroundColor: workspaceInfo?.name ? theme.editor.shortcutBadgeBg : undefined,
                    borderColor: workspaceInfo?.name ? theme.editor.shortcutBadgeBorder : undefined,
                    color: workspaceInfo?.name ? theme.editor.emptyText : undefined
                  }}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
                    workspaceInfo?.name
                      ? `border shadow-sm ${theme.isLight ? 'hover:bg-zinc-100 text-zinc-800' : 'hover:bg-zinc-700/50 text-zinc-200'}`
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
                  }`}
                >
                  <FolderOpen size={13} className="text-amber-500" />
                  <span>{workspaceInfo?.name ? 'Ganti Folder Project' : 'Buka Folder Project'}</span>
                  <kbd className={`${theme.isLight ? 'bg-zinc-200/80 text-zinc-700' : 'bg-white/20 text-blue-100'} text-[10px] px-1.5 py-0.5 rounded font-mono ml-1`}>Ctrl+O</kbd>
                </button>
              </div>

              {/* Inline Create File Prompt */}
              {showNewFileInput && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newFileName.trim()) return;
                    if (onCreateItem) {
                      onCreateItem(newFileName.trim(), 'file');
                    }
                    setNewFileName('');
                    setShowNewFileInput(false);
                  }} 
                  className="flex items-center space-x-2 mb-4 w-full max-w-xs"
                >
                  <input
                    type="text"
                    autoFocus
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="nama_file (contoh: main.py)"
                    className={`flex-1 border border-blue-500 rounded px-2.5 py-1 text-xs focus:outline-none shadow-inner ${
                      theme.isLight ? 'bg-white text-zinc-900 placeholder-zinc-400' : 'bg-zinc-900 text-white placeholder-zinc-500'
                    }`}
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1 rounded font-medium">
                    Buat
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setShowNewFileInput(false); setNewFileName(''); }} 
                    className={`${theme.isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'} text-xs px-1.5 py-1`}
                  >
                    Batal
                  </button>
                </form>
              )}

              {/* Keyboard Shortcuts 2-Column Grid */}
              <div 
                style={{ 
                  backgroundColor: theme.editor.shortcutBadgeBg, 
                  borderColor: theme.editor.shortcutBadgeBorder 
                }} 
                className="border rounded-xl p-3 sm:p-3.5 w-full shadow-sm text-xs"
              >
                <div 
                  className="text-[10px] font-semibold uppercase tracking-wider mb-2 text-left px-1" 
                  style={{ color: theme.editor.emptyMuted }}
                >
                  Pintasan Keyboard (Shortcuts)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left">
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Buka Folder</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#2563eb' : '#93c5fd' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      Ctrl + O
                    </kbd>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Simpan File</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      Ctrl + S
                    </kbd>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Format Dokumen</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#2563eb' : '#93c5fd' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      Shift + Alt + F
                    </kbd>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Code Snippet</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#2563eb' : '#93c5fd' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      sout, clg + Tab
                    </kbd>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Jalankan Script</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      Tombol Run
                    </kbd>
                  </div>
                  <div 
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md ${theme.isLight ? 'bg-zinc-100 hover:bg-zinc-200/60' : 'bg-black/15 hover:bg-black/25'}`} 
                    style={{ color: theme.editor.emptyText }}
                  >
                    <span className="text-[11px] truncate mr-2">Toggle Terminal</span>
                    <kbd 
                      style={{ backgroundColor: theme.isLight ? '#e5e7eb' : '#27272a', color: theme.isLight ? '#374151' : '#e4e4e7' }} 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0"
                    >
                      Ctrl + `
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
