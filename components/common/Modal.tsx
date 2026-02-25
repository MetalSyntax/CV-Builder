import React, { useState, useEffect } from 'react';
import { X, AlertCircle, HelpCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value?: string) => void;
  title: string;
  message: string;
  type: 'confirm' | 'prompt';
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  defaultValue = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar'
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-950 w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${type === 'confirm' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'}`}>
              {type === 'confirm' ? <AlertCircle size={20} /> : <HelpCircle size={20} />}
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-zinc-400 mb-6 font-medium leading-relaxed">
          {message}
        </p>

        {type === 'prompt' && (
          <div className="mb-6">
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onConfirm(inputValue)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-bold"
              placeholder="Escribe aquí..."
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-2xl text-gray-500 dark:text-zinc-400 font-black uppercase text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(type === 'prompt' ? inputValue : undefined)}
            className={`flex-1 px-6 py-3.5 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-95 ${
              type === 'confirm' && title.toLowerCase().includes('eliminar')
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
