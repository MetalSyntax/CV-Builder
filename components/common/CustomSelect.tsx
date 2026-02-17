import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  label?: string;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, label, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="space-y-1.5 flex-1 relative" ref={containerRef}>
      {label && (
        <label className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1 flex items-center gap-1">
          {icon} {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-800 dark:text-white flex items-center justify-between hover:border-teal-500/30 transition-all ${isOpen ? 'ring-2 ring-teal-500/10 border-teal-500/50' : ''}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl shadow-teal-500/10 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[11px] font-bold transition-colors hover:bg-teal-50 dark:hover:bg-teal-500/10 ${
                value === option.value 
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-500/5' 
                  : 'text-gray-600 dark:text-zinc-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
