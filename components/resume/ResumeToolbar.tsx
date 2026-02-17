import React from 'react';
import { Bold, Italic } from 'lucide-react';

interface ResumeToolbarProps {
  show: boolean;
  top: number;
  left: number;
  onExecCommand: (cmd: string) => void;
  onUpdateFontSize: (delta: number) => void;
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  show,
  top,
  left,
  onExecCommand,
  onUpdateFontSize,
}) => {
  if (!show) return null;

  return (
    <div
      className="absolute z-50 flex items-center bg-zinc-900 text-white rounded-lg shadow-2xl p-1 border border-white/10"
      style={{ top, left }}
    >
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecCommand('bold')}
        className="p-2 hover:bg-white/10 rounded"
      >
        <Bold size={14} />
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onExecCommand('italic')}
        className="p-2 hover:bg-white/10 rounded"
      >
        <Italic size={14} />
      </button>
      <div className="w-px h-4 bg-white/20 mx-1" />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateFontSize(-1)}
        className="p-2 hover:bg-white/10 rounded px-3 text-[10px]"
      >
        A-
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateFontSize(1)}
        className="p-2 hover:bg-white/10 rounded px-3 text-[10px]"
      >
        A+
      </button>
    </div>
  );
};
