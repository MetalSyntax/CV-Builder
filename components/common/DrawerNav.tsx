import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerNavProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const DrawerNav: React.FC<DrawerNavProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] md:hidden flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white dark:bg-zinc-950 w-[85vw] max-w-xs h-full shadow-2xl border-r border-gray-200 dark:border-zinc-800 flex flex-col animate-slide-in-left"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2 rounded-xl">
              <span className="text-teal-500 font-black text-base">V</span>
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800 dark:text-white">VITAE</h2>
              <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest">Mis CVs</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
