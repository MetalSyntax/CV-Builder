import React, { useState, useEffect } from 'react';
import { Calendar, Check } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface DateRangePickerProps {
  value: string;
  dateFormat?: string;
  separator?: string;
  onChange: (value: string) => void;
  label: string;
  extraAction?: React.ReactNode;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  dateFormat = 'MM/YYYY', 
  separator = ' - ', 
  onChange,
  label,
  extraAction
}) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isActual, setIsActual] = useState(false);

  const handleUpdate = (newStart: string, newEnd: string, actual: boolean) => {
    setStart(newStart);
    setEnd(newEnd);
    setIsActual(actual);

    if (dateFormat === 'TEXT') return;

    const startFmt = formatDate(newStart, dateFormat);
    const endFmt = actual ? 'Actualidad' : formatDate(newEnd, dateFormat);
    
    if (startFmt && endFmt) {
      onChange(`${startFmt}${separator}${endFmt}`);
    } else if (startFmt) {
      onChange(startFmt);
    }
  };

  if (dateFormat === 'TEXT') return null;

  return (
    <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-zinc-950/20 rounded-2xl border border-gray-100 dark:border-zinc-800/80 transition-all hover:border-teal-500/20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] pl-0.5 flex items-center gap-2">
            <Calendar size={12} className="text-teal-500" /> {label}
          </label>
          {extraAction}
        </div>
        
        <button
          onClick={() => handleUpdate(start, end, !isActual)}
          className={`group flex items-center gap-2 px-2 py-1 rounded-lg border transition-all ${
            isActual 
              ? 'bg-teal-500 border-teal-500 text-white shadow-sm shadow-teal-500/20' 
              : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-400 hover:border-teal-500/30 hover:text-teal-500'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
            isActual ? 'bg-white/20 border-white/40' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 group-hover:border-teal-500/50'
          }`}>
            {isActual && <Check size={10} strokeWidth={4} />}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">En Curso</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Desde</span>
          <div className="relative group">
            <input 
              type="date"
              value={start}
              onChange={(e) => handleUpdate(e.target.value, end, isActual)}
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Hasta</span>
          <div className="relative group">
            <input 
              type="date"
              value={end}
              disabled={isActual}
              onChange={(e) => handleUpdate(start, e.target.value, isActual)}
              className={`w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] font-bold outline-none transition-all ${
                isActual 
                  ? 'bg-teal-500/5 text-teal-600/50 dark:text-teal-400/50 border-teal-500/10 cursor-not-allowed opacity-50' 
                  : 'text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500/50 cursor-pointer'
              }`}
            />
            {isActual && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20">Presente</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
