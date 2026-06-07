import React from 'react';
import { Edit3, Eye, Palette, User } from 'lucide-react';

type MobileTab = 'content' | 'preview' | 'design' | 'user';

interface BottomNavProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'Editar', icon: <Edit3 size={20} /> },
  { id: 'preview', label: 'Preview', icon: <Eye size={20} /> },
  { id: 'design', label: 'Diseño', icon: <Palette size={20} /> },
  { id: 'user', label: 'Perfil', icon: <User size={20} /> },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors min-h-[56px] ${
            activeTab === tab.id
              ? 'text-teal-500'
              : 'text-gray-400 dark:text-zinc-500'
          }`}
        >
          {tab.icon}
          <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
