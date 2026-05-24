import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignJustify } from 'lucide-react';

interface ResumeToolbarProps {
  show: boolean;
  top: number;
  left: number;
  onExecCommand: (cmd: string) => void;
  onUpdateFontSize: (delta: number) => void;
  onUpdateLineHeight: (delta: number) => void;
  currentFontSize: number;
  currentLineHeight: number;
  activeFormats: { bold: boolean; italic: boolean; underline: boolean; justifyFull: boolean };
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  show,
  top,
  left,
  onExecCommand,
  onUpdateFontSize,
  onUpdateLineHeight,
  currentFontSize,
  currentLineHeight,
  activeFormats,
}) => {
  if (!show) return null;

  const Btn = ({
    cmd,
    active,
    title,
    children,
  }: {
    cmd: string;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onExecCommand(cmd)}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-teal-500 text-white'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      className="fixed z-[9999] flex items-center gap-0.5 bg-zinc-900 text-white rounded-xl shadow-2xl px-2 py-1.5 border border-white/10 print:hidden"
      style={{ top, left }}
    >
      <Btn cmd="bold" active={activeFormats.bold} title="Negrita (Ctrl+B)">
        <Bold size={13} />
      </Btn>
      <Btn cmd="italic" active={activeFormats.italic} title="Cursiva (Ctrl+I)">
        <Italic size={13} />
      </Btn>
      <Btn cmd="underline" active={activeFormats.underline} title="Subrayado (Ctrl+U)">
        <Underline size={13} />
      </Btn>

      <div className="w-px h-4 bg-white/20 mx-1 flex-shrink-0" />

      <Btn cmd="justifyLeft" active={!activeFormats.justifyFull} title="Alinear izquierda">
        <AlignLeft size={13} />
      </Btn>
      <Btn cmd="justifyFull" active={activeFormats.justifyFull} title="Justificar texto">
        <AlignJustify size={13} />
      </Btn>

      <div className="w-px h-4 bg-white/20 mx-1 flex-shrink-0" />

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateFontSize(-1)}
        title="Reducir tamaño de fuente"
        className="px-2 py-1 rounded text-[10px] font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        A−
      </button>
      <span className="text-[10px] font-bold text-white/90 px-1">{currentFontSize}</span>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateFontSize(1)}
        title="Aumentar tamaño de fuente"
        className="px-2 py-1 rounded text-[10px] font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        A+
      </button>

      <div className="w-px h-4 bg-white/20 mx-1 flex-shrink-0" />

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateLineHeight(-0.1)}
        title="Reducir interlineado"
        className="px-2 py-1 rounded text-[10px] font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        ↕−
      </button>
      <span className="text-[10px] font-bold text-white/90 px-1">{currentLineHeight.toFixed(1)}</span>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onUpdateLineHeight(0.1)}
        title="Aumentar interlineado"
        className="px-2 py-1 rounded text-[10px] font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        ↕+
      </button>
    </div>
  );
};
