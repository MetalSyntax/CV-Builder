import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface EditorFormSectionProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  onAdd?: () => void;
  children: React.ReactNode;
}

export const EditorFormSection: React.FC<EditorFormSectionProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-teal-600 dark:text-teal-400",
  onAdd,
  children
}) => {
  return (
    <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-500/10 rounded-xl">
            <Icon size={18} className={iconColorClass} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-800 dark:text-zinc-200">{title}</h3>
            {subtitle && <p className="text-[10px] text-gray-400 font-medium tracking-tight">{subtitle}</p>}
          </div>
        </div>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="bg-gray-50 hover:bg-teal-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-teal-600 text-gray-500 p-2.5 rounded-xl transition-all active:scale-95 shadow-sm border border-gray-100 dark:border-zinc-700"
          >
            <Plus size={18} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
};
