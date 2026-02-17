import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronUp, ChevronDown, Type, GripVertical } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { DateRangePicker } from './DateRangePicker';

interface EducationFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onMoveItem: (field: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  removeItem: (field: keyof ResumeData, index: number) => void;
  updateItem: (field: keyof ResumeData, index: number, itemField: string, value: any) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onChange,
  onMoveItem,
  addItem,
  removeItem,
  updateItem
}) => {
  const [draggedEduIdx, setDraggedEduIdx] = useState<number | null>(null);
  const [showManual, setShowManual] = useState<Record<number, boolean>>({});

  if (data.hiddenSections?.includes('education')) return null;

  const toggleManual = (idx: number) => {
    setShowManual(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedEduIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedEduIdx === null || draggedEduIdx === idx) return;

    const list = [...data.education];
    const [movedItem] = list.splice(draggedEduIdx, 1);
    list.splice(idx, 0, movedItem);
    
    const newData = { ...data, education: list };
    onChange(newData);
    setDraggedEduIdx(idx);
  };

  return (
    <EditorFormSection 
      title="Educación" 
      subtitle="Tu formación académica" 
      icon={GraduationCap}
      onAdd={() => addItem('education', { degree: '', institution: '', period: '', location: '' })}
    >
      <div className="space-y-4">
        {data.education.map((edu, idx) => (
          <div 
            key={idx} 
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDraggedEduIdx(null)}
            className={`bg-gray-50/50 dark:bg-zinc-950/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all ${draggedEduIdx === idx ? 'opacity-0 scale-95' : 'opacity-100'}`}
          >
             <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <div className="p-1.5 text-gray-300 cursor-grab active:cursor-grabbing hover:text-teal-500 transition-colors">
                  <GripVertical size={14} />
                </div>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('education', idx)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Título / Grado</label>
                  <input 
                    value={edu.degree} 
                    onChange={(e) => updateItem('education', idx, 'degree', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                    placeholder="Ejem: Ingeniero de Software"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Institución</label>
                  <input 
                    value={edu.institution} 
                    onChange={(e) => updateItem('education', idx, 'institution', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                    placeholder="Universidad"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <DateRangePicker 
                  label="Periodo"
                  value={edu.period}
                  dateFormat={data.dateFormat}
                  separator={data.dateRangeSeparator}
                  onChange={(val) => updateItem('education', idx, 'period', val)}
                  extraAction={
                    <button 
                      onClick={() => toggleManual(idx)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        showManual[idx] 
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                          : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800 hover:border-teal-500/30 hover:text-teal-500'
                      }`}
                      title="Edición Manual"
                    >
                      <Type size={14} />
                    </button>
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  {showManual[idx] && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Periodo (Manual)</label>
                      <input 
                        value={edu.period} 
                        onChange={(e) => updateItem('education', idx, 'period', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-teal-500/30 rounded-lg py-1.5 px-3 text-xs font-bold text-teal-600 dark:text-teal-400 outline-none"
                        placeholder="2016 - 2020"
                      />
                    </div>
                  )}
                  <div className={`space-y-1 ${!showManual[idx] ? 'col-span-2' : ''}`}>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Ubicación</label>
                    <input 
                      value={edu.location} 
                      onChange={(e) => updateItem('education', idx, 'location', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                      placeholder="Ciudad"
                    />
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>
    </EditorFormSection>
  );
};
