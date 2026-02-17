import React, { useState } from 'react';
import { Briefcase, Plus, Minus, Trash2, ChevronUp, ChevronDown, Calendar, GripVertical, Type } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { DateRangePicker } from './DateRangePicker';

interface ExperienceFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onMoveItem: (field: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  removeItem: (field: keyof ResumeData, index: number) => void;
  updateItem: (field: keyof ResumeData, index: number, itemField: string, value: any) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  data,
  onChange,
  onMoveItem,
  addItem,
  removeItem,
  updateItem
}) => {
  const [draggedTask, setDraggedTask] = useState<{ expIdx: number, taskIdx: number } | null>(null);
  const [draggedExpIdx, setDraggedExpIdx] = useState<number | null>(null);
  const [showManual, setShowManual] = useState<Record<number, boolean>>({});

  if (data.hiddenSections?.includes('experience')) return null;

  const toggleManual = (idx: number) => {
    setShowManual(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleTaskDragStart = (e: React.DragEvent, expIdx: number, taskIdx: number) => {
    e.stopPropagation();
    setDraggedTask({ expIdx, taskIdx });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDragOver = (e: React.DragEvent, expIdx: number, taskIdx: number) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.expIdx !== expIdx || draggedTask.taskIdx === taskIdx) return;

    const exp = data.experience[expIdx];
    const newTasks = [...exp.tasks];
    const [movedTask] = newTasks.splice(draggedTask.taskIdx, 1);
    newTasks.splice(taskIdx, 0, movedTask);
    
    updateItem('experience', expIdx, 'tasks', newTasks);
    setDraggedTask({ expIdx, taskIdx });
  };

  const handleExpDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedExpIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleExpDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedExpIdx === null || draggedExpIdx === idx) return;

    const list = [...data.experience];
    const [movedItem] = list.splice(draggedExpIdx, 1);
    list.splice(idx, 0, movedItem);
    
    const newData = { ...data, experience: list };
    onChange(newData);
    setDraggedExpIdx(idx);
  };

  return (
    <EditorFormSection 
      title="Experiencia" 
      subtitle="Tus roles profesionales más recientes" 
      icon={Briefcase}
      onAdd={() => addItem('experience', { role: '', company: '', period: '', location: '', tasks: [''] })}
    >
      <div className="space-y-4">
        {data.experience.map((exp, idx) => (
          <div 
            key={idx} 
            draggable
            onDragStart={(e) => handleExpDragStart(e, idx)}
            onDragOver={(e) => handleExpDragOver(e, idx)}
            onDragEnd={() => setDraggedExpIdx(null)}
            className={`bg-gray-50/50 dark:bg-zinc-950/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all ${draggedExpIdx === idx ? 'opacity-0 scale-95' : 'opacity-100'}`}
          >
             <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <div className="p-1.5 text-gray-300 cursor-grab active:cursor-grabbing hover:text-teal-500 transition-colors">
                  <GripVertical size={14} />
                </div>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('experience', idx)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Cargo / Puesto</label>
                  <input 
                    value={exp.role} 
                    onChange={(e) => updateItem('experience', idx, 'role', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                    placeholder="Puesto"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Empresa</label>
                  <input 
                    value={exp.company} 
                    onChange={(e) => updateItem('experience', idx, 'company', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                    placeholder="Empresa"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <DateRangePicker 
                  label="Periodo"
                  value={exp.period}
                  dateFormat={data.dateFormat}
                  separator={data.dateRangeSeparator}
                  onChange={(val) => updateItem('experience', idx, 'period', val)}
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
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Texto del Periodo (Manual)</label>
                      <input 
                        value={exp.period} 
                        onChange={(e) => updateItem('experience', idx, 'period', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-teal-500/30 rounded-lg py-1.5 px-3 text-xs font-bold text-teal-600 dark:text-teal-400 outline-none"
                        placeholder="Ejem: 2020 - Actualidad"
                      />
                    </div>
                  )}
                  <div className={`space-y-1 ${!showManual[idx] ? 'col-span-2' : ''}`}>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Ubicación</label>
                    <input 
                      value={exp.location} 
                      onChange={(e) => updateItem('experience', idx, 'location', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none"
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">Tareas y Logros</label>
                <div className="space-y-2">
                  {exp.tasks.map((task, tidx) => (
                    <div 
                      key={tidx} 
                      draggable
                      onDragStart={(e) => handleTaskDragStart(e, idx, tidx)}
                      onDragOver={(e) => handleTaskDragOver(e, idx, tidx)}
                      onDragEnd={() => setDraggedTask(null)}
                      className={`flex gap-2 items-start group/task transition-all ${draggedTask?.expIdx === idx && draggedTask?.taskIdx === tidx ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    >
                      <GripVertical size={12} className="text-gray-300 group-hover/task:text-teal-500 transition-colors shrink-0 mt-2 cursor-grab active:cursor-grabbing" />
                      <textarea 
                        value={task} 
                        onChange={(e) => {
                          const newTasks = [...exp.tasks];
                          newTasks[tidx] = e.target.value;
                          updateItem('experience', idx, 'tasks', newTasks);
                        }}
                        className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none min-h-[40px] resize-none"
                        placeholder="Describe una tarea o logro..."
                      />
                      <button 
                        onClick={() => {
                          const newTasks = exp.tasks.filter((_, i) => i !== tidx);
                          updateItem('experience', idx, 'tasks', newTasks);
                        }}
                        className="p-1 text-gray-300 hover:text-red-500 h-fit"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newTasks = [...exp.tasks, ''];
                      updateItem('experience', idx, 'tasks', newTasks);
                    }}
                    className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 uppercase tracking-widest pl-1 pt-1"
                  >
                    <Plus size={10} /> Añadir Tarea
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>
    </EditorFormSection>
  );
};
