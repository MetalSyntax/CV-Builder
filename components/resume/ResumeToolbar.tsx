import React from 'react';

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
  onUpdateFontSize,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed z-[9999] flex items-center bg-zinc-900 text-white rounded-lg shadow-2xl p-1 border border-white/10 print:hidden"
      style={{ top, left }}
    >
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
