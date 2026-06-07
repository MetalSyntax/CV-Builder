import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end md:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-zinc-800 animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
        </div>
        {title && (
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-800 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors rounded-lg">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
