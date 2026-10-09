import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, Trash2, X, ChevronRight, CornerDownLeft, 
  Maximize2, Minimize2, Minus, ChevronUp, Square, Copy, Check 
} from 'lucide-react';
import { getTheme } from '../utils/themeHelper';

export default function TerminalPanel({
  isOpen,
  onClose,
  output,
  onClear,
  isRunning,
  onRunCustomCommand,
  onStopProcess,
  theme: userTheme
}) {
  const theme = userTheme || getTheme('nemesis-dark');
  const [cmdInput, setCmdInput] = useState('');
  const [panelHeight, setPanelHeight] = useState(230);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);

  const terminalEndRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(230);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalEndRef.current && !isMinimized) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, isMinimized]);

  // Drag-to-resize listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(90, Math.min(window.innerHeight - 120, startHeightRef.current + deltaY));
      setPanelHeight(newHeight);
      setIsMaximized(false);
      setIsMinimized(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;
  };

  const handleToggleMaximize = () => {
    if (isMinimized) setIsMinimized(false);
    setIsMaximized(!isMaximized);
  };

  const handleToggleMinimize = () => {
    if (isMaximized) setIsMaximized(false);
    setIsMinimized(!isMinimized);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = cmdInput.trim();
    if (!clean) return;

    // Check for clear / cls commands locally
    if (clean.toLowerCase() === 'clear' || clean.toLowerCase() === 'cls') {
      if (onClear) onClear();
      setCmdInput('');
      return;
    }

    if (isRunning) return;

    setHistory((prev) => [...prev, clean]);
    setHistoryIndex(-1);
    onRunCustomCommand(clean);
    setCmdInput('');
  };

  const handleKeyDown = (e) => {
    // Up arrow: previous command history
    if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        e.preventDefault();
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCmdInput(history[nextIdx] || '');
      }
    } 
    // Down arrow: next command history
    else if (e.key === 'ArrowDown') {
      if (historyIndex !== -1) {
        e.preventDefault();
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setCmdInput('');
        } else {
          setHistoryIndex(nextIdx);
          setCmdInput(history[nextIdx] || '');
        }
      }
    }
    // Ctrl+L: Clear terminal shortcut
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      if (onClear) onClear();
    }
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const calculatedHeight = isMinimized 
    ? '34px' 
    : isMaximized 
    ? 'calc(100% - 36px)' 
    : `${panelHeight}px`;

  return (
    <div 
      style={{ 
        height: calculatedHeight,
        backgroundColor: theme.terminal.bg,
        borderColor: theme.terminal.border
      }}
      className={`border-t flex flex-col shrink-0 z-20 select-none transition-all duration-75 relative ${
        isMaximized ? 'absolute inset-x-0 bottom-0 top-[36px] !h-auto' : ''
      }`}
    >
      {/* 1. Drag-to-Resize Handle on Top Edge */}
      {!isMaximized && (
        <div
          onMouseDown={handleDragStart}
          className="absolute -top-1 inset-x-0 h-2 cursor-row-resize z-30 hover:bg-blue-500/30 transition-colors"
          title="Tarik ke atas atau ke bawah untuk mengubah ukuran terminal"
        />
      )}

      {/* 2. Panel Header */}
      <div 
        style={{ 
          backgroundColor: theme.terminal.headerBg, 
          borderColor: theme.terminal.headerBorder 
        }}
        className="flex items-center justify-between px-3 py-1.5 border-b text-xs h-[34px] min-h-[34px] transition-colors"
      >
        {/* Left: Title & Status */}
        <div className="flex items-center space-x-2">
          <TerminalIcon size={14} style={{ color: theme.terminal.promptText }} />
          <span style={{ color: theme.terminal.headerText }} className="font-semibold">Terminal & Output</span>
          {isRunning && (
            <span className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Menjalankan proses...</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Stop, Copy, Clear, Maximize, Minimize, Close) */}
        <div className="flex items-center space-x-1">
          {/* Stop / Kill Process Button */}
          {isRunning && onStopProcess && (
            <button
              onClick={onStopProcess}
              title="Hentikan Proses (Stop Process)"
              className="px-2 py-0.5 bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 hover:text-white rounded text-[11px] font-medium flex items-center space-x-1 transition-colors"
            >
              <Square size={11} className="fill-red-400" />
              <span>Stop</span>
            </button>
          )}

          {/* Copy Output */}
          <button
            onClick={handleCopyOutput}
            title={copied ? "Tersalin ke Clipboard!" : "Salin Seluruh Output"}
            className={`p-1 rounded transition-colors ${theme.terminal.buttonHover}`}
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>

          {/* Clear Output (Trash) */}
          <button
            onClick={onClear}
            title="Bersihkan Terminal (Hapus output / Ctrl+L)"
            className={`p-1 rounded transition-colors ${theme.terminal.buttonHover}`}
          >
            <Trash2 size={13} />
          </button>

          {/* Maximize / Restore Button */}
          <button
            onClick={handleToggleMaximize}
            title={isMaximized ? "Kembalikan Ukuran Semula (Restore)" : "Perbesar Penuh (Maximize)"}
            className={`p-1 rounded transition-colors ${theme.terminal.buttonHover}`}
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Minimize / Expand Button */}
          <button
            onClick={handleToggleMinimize}
            title={isMinimized ? "Kembangkan Terminal" : "Kecilkan Terminal (Minimize)"}
            className={`p-1 rounded transition-colors ${theme.terminal.buttonHover}`}
          >
            {isMinimized ? <ChevronUp size={13} /> : <Minus size={13} />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            title="Tutup Panel Terminal"
            className={`p-1 rounded transition-colors ${theme.terminal.buttonHover}`}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* 3. Terminal Output Area (Hidden if minimized) */}
      {!isMinimized && (
        <>
          <div 
            style={{ 
              backgroundColor: theme.terminal.outputBg, 
              color: theme.terminal.outputText 
            }}
            className="flex-1 overflow-y-auto p-3 font-mono text-xs select-text whitespace-pre-wrap leading-relaxed transition-colors"
          >
            {output ? (
              <div>{output}</div>
            ) : (
              <div style={{ color: theme.isLight ? '#9ca3af' : '#71717a' }} className="italic">
                Output proses akan muncul di sini. Klik "Run Code" atau ketik perintah di bawah (ketik 'clear' untuk hapus).
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* 4. Command Prompt Input */}
          <form
            onSubmit={handleSubmit}
            style={{ 
              backgroundColor: theme.terminal.inputBg, 
              borderColor: theme.terminal.border 
            }}
            className="flex items-center px-3 py-1.5 border-t transition-colors"
          >
            <ChevronRight size={14} style={{ color: theme.terminal.promptText }} className="mr-2 shrink-0" />
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              style={{ color: theme.terminal.inputText }}
              placeholder={
                isRunning 
                  ? "Menunggu proses selesai... (Klik tombol 'Stop' di atas untuk membatalkan)" 
                  : "Ketik perintah (contoh: python main.py, dir, atau 'clear' untuk hapus output)..."
              }
              className="flex-1 bg-transparent text-xs font-mono outline-none placeholder:text-zinc-500 opacity-90"
            />
            {cmdInput && (
              <button
                type="button"
                onClick={() => setCmdInput('')}
                title="Kosongkan input teks"
                className="text-zinc-400 hover:text-zinc-600 mr-1 p-0.5"
              >
                <X size={12} />
              </button>
            )}
            <button
              type="submit"
              disabled={isRunning || !cmdInput.trim()}
              title="Kirim Perintah (Enter)"
              className="p-1 text-zinc-400 hover:text-blue-500 disabled:opacity-40 transition-colors"
            >
              <CornerDownLeft size={13} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
