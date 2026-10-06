import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2, X, ChevronRight, CornerDownLeft } from 'lucide-react';

export default function TerminalPanel({
  isOpen,
  onClose,
  output,
  onClear,
  isRunning,
  onRunCustomCommand
}) {
  const [cmdInput, setCmdInput] = useState('');
  const terminalEndRef = useRef(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cmdInput.trim() || isRunning) return;
    onRunCustomCommand(cmdInput.trim());
    setCmdInput('');
  };

  return (
    <div className="h-56 bg-[#141416] border-t border-[#27272a] flex flex-col z-10 select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181b] border-b border-[#27272a] text-xs">
        <div className="flex items-center space-x-2">
          <TerminalIcon size={14} className="text-zinc-400" />
          <span className="font-semibold text-zinc-300">Terminal & Output</span>
          {isRunning && (
            <span className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Menjalankan proses...</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onClear}
            title="Bersihkan Terminal"
            className="p-1 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={onClose}
            title="Tutup Terminal"
            className="p-1 text-zinc-400 hover:text-white hover:bg-[#27272a] rounded transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-zinc-300 select-text whitespace-pre-wrap leading-relaxed bg-[#121214]">
        {output ? (
          <div>{output}</div>
        ) : (
          <div className="text-zinc-600 italic">
            Output proses akan muncul di sini. Klik "Run Code" atau ketik perintah di bawah.
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Prompt Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center px-3 py-1.5 bg-[#18181b] border-t border-[#27272a]"
      >
        <ChevronRight size={14} className="text-blue-400 mr-2 shrink-0" />
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          disabled={isRunning}
          placeholder={isRunning ? "Menunggu proses selesai..." : "Ketik perintah (contoh: python main.py atau dir)..."}
          className="flex-1 bg-transparent text-xs font-mono text-zinc-200 outline-none placeholder:text-zinc-600"
        />
        <button
          type="submit"
          disabled={isRunning || !cmdInput.trim()}
          className="p-1 text-zinc-400 hover:text-blue-400 disabled:opacity-40 transition-colors"
        >
          <CornerDownLeft size={13} />
        </button>
      </form>
    </div>
  );
}
