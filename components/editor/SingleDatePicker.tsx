import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface SingleDatePickerProps {
  value: string;
  dateFormat?: string;
  onChange: (value: string) => void;
  label: string;
  extraAction?: React.ReactNode;
}

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({ 
  value, 
  dateFormat = 'MM/YYYY', 
  onChange,
  label,
  extraAction
}) => {
  const [date, setDate] = useState('');

  const handleUpdate = (newDate: string) => {
    setDate(newDate);
    if (dateFormat === 'TEXT') return;
    const fmt = formatDate(newDate, dateFormat);
    if (fmt) onChange(fmt);
  };

  if (dateFormat === 'TEXT') return null;

  return (
    <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-zinc-950/20 rounded-2xl border border-gray-100 dark:border-zinc-800/80 transition-all hover:border-teal-500/20">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] pl-0.5 flex items-center gap-2">
          <Calendar size={12} className="text-teal-500" /> {label}
        </label>
        {extraAction}
      </div>
      <div className="relative group">
        <input 
          type="date"
          value={date}
          onChange={(e) => handleUpdate(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
};
