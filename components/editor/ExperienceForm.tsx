import React, { useState } from 'react';
import { Briefcase, Plus, Minus, Trash2, ChevronUp, ChevronDown, Calendar, GripVertical, Type, Eye, EyeOff, Archive, RotateCcw, ChevronRight } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { DateRangePicker } from './DateRangePicker';
import { AutoResizeTextarea } from './AutoResizeTextarea';

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
  const [showArchived, setShowArchived] = useState<Record<number, boolean>>({});

  if (data.hiddenSections?.includes('experience')) return null;

  const toggleManual = (idx: number) => {
    setShowManual(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleCollapsed = (idx: number) => {
    updateItem('experience', idx, 'collapsed', !data.experience[idx].collapsed);
  };

  const archiveTask = (expIdx: number, taskIdx: number) => {
    const exp = data.experience[expIdx];
    const taskText = exp.tasks[taskIdx];
    if (!taskText.trim()) {
      const newTasks = exp.tasks.filter((_, i) => i !== taskIdx);
      updateItem('experience', expIdx, 'tasks', newTasks);
      return;
    }
    const newTasks = exp.tasks.filter((_, i) => i !== taskIdx);
    const newArchived = [...(exp.archivedTasks || []), taskText];
    const newList = [...data.experience];
    newList[expIdx] = { ...exp, tasks: newTasks, archivedTasks: newArchived };
    onChange({ ...data, experience: newList });
  };

  const restoreTask = (expIdx: number, archivedIdx: number) => {
    const exp = data.experience[expIdx];
    const taskText = (exp.archivedTasks || [])[archivedIdx];
    const newArchived = (exp.archivedTasks || []).filter((_, i) => i !== archivedIdx);
    const newTasks = [...exp.tasks, taskText];
    const newList = [...data.experience];
    newList[expIdx] = { ...exp, tasks: newTasks, archivedTasks: newArchived };
    onChange({ ...data, experience: newList });
  };

  const deleteArchivedTask = (expIdx: number, archivedIdx: number) => {
    const exp = data.experience[expIdx];
    const newArchived = (exp.archivedTasks || []).filter((_, i) => i !== archivedIdx);
    updateItem('experience', expIdx, 'archivedTasks', newArchived);
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
        {data.experience.map((exp, idx) => {
          const isCollapsed = exp.collapsed ?? false;
          const archived = exp.archivedTasks || [];

          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleExpDragStart(e, idx)}
              onDragOver={(e) => handleExpDragOver(e, idx)}
              onDragEnd={() => setDraggedExpIdx(null)}
              className={`rounded-xl border relative group transition-all
                ${draggedExpIdx === idx ? 'opacity-0 scale-95' : exp.hidden ? 'opacity-60' : 'opacity-100'}
                ${exp.hidden
                  ? 'bg-amber-50/30 dark:bg-amber-900/5 border-dashed border-amber-200 dark:border-amber-800/40'
                  : 'bg-gray-50/50 dark:bg-zinc-950/50 border-gray-100 dark:border-zinc-800'
                }
                ${exp.avoidBreak ? 'print:break-inside-avoid' : ''}`}
            >
              {/* Header row - always visible */}
              <div
                className="flex items-center gap-2 px-4 pt-3 pb-3 cursor-pointer select-none"
                onClick={() => toggleCollapsed(idx)}
              >
                <ChevronRight
                  size={14}
                  className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate block">
                    {exp.role || <span className="text-gray-400 italic font-normal">Sin cargo</span>}
                  </span>
                  {exp.company && (
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 truncate block">
                      {exp.company}{exp.period ? ` · ${exp.period}` : ''}
                    </span>
                  )}
                </div>
                <div
                  className="flex gap-0.5 items-center flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-0.5 items-center bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm">
                    <div className="p-1.5 text-gray-300 cursor-grab active:cursor-grabbing hover:text-teal-500 transition-colors">
                      <GripVertical size={14} />
                    </div>
                    <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-0.5"></div>
                    <button
                      onClick={() => updateItem('experience', idx, 'hidden', !exp.hidden)}
                      className={`p-1.5 transition-colors ${exp.hidden ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                      title={exp.hidden ? 'Mostrar en CV' : 'Ocultar del CV'}
                    >
                      {exp.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-0.5"></div>
                    <button
                      onClick={() => updateItem('experience', idx, 'avoidBreak', !exp.avoidBreak)}
                      className={`p-1.5 transition-colors text-[8px] font-black ${exp.avoidBreak ? 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'text-gray-300 hover:text-teal-500'}`}
                      title={exp.avoidBreak ? 'Permitir corte de página' : 'Evitar corte de página'}
                    >
                      ↕
                    </button>
                    <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-0.5"></div>
                    <button onClick={() => removeItem('experience', idx)} className="p-1.5 text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible content */}
              {!isCollapsed && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Cargo / Puesto</label>
                      <AutoResizeTextarea
                        value={exp.role}
                        onChange={(e) => updateItem('experience', idx, 'role', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                        placeholder="Puesto"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Empresa</label>
                      <AutoResizeTextarea
                        value={exp.company}
                        onChange={(e) => updateItem('experience', idx, 'company', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                        placeholder="Empresa"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
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
                          <AutoResizeTextarea
                            value={exp.period}
                            onChange={(e) => updateItem('experience', idx, 'period', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-teal-500/30 rounded-lg py-1.5 px-3 text-xs font-bold text-teal-600 dark:text-teal-400 outline-none leading-normal"
                            placeholder="Ejem: 2020 - Actualidad"
                          />
                        </div>
                      )}
                      <div className={`space-y-1 ${!showManual[idx] ? 'col-span-2' : ''}`}>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Ubicación</label>
                        <AutoResizeTextarea
                          value={exp.location}
                          onChange={(e) => updateItem('experience', idx, 'location', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                          placeholder="Ciudad, País"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Descripción de la Empresa</label>
                        <AutoResizeTextarea
                          value={exp.companyDescription || ''}
                          onChange={(e) => updateItem('experience', idx, 'companyDescription', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                          placeholder="Ejem: AroPlastic es una empresa..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Contacto de Referencia</label>
                        <AutoResizeTextarea
                          value={exp.companyContact || ''}
                          onChange={(e) => updateItem('experience', idx, 'companyContact', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                          placeholder="Ejem: Jusleinys Sequera - 0424-292-0023"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active tasks */}
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
                          <AutoResizeTextarea
                            value={task}
                            onChange={(e) => {
                              const newTasks = [...exp.tasks];
                              newTasks[tidx] = e.target.value;
                              updateItem('experience', idx, 'tasks', newTasks);
                            }}
                            className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal"
                            placeholder="Describe una tarea o logro..."
                          />
                          <button
                            onClick={() => archiveTask(idx, tidx)}
                            className="p-1 text-gray-300 hover:text-amber-500 h-fit mt-0.5 transition-colors"
                            title="Archivar tarea (guardar sin mostrar en CV)"
                          >
                            <Archive size={13} />
                          </button>
                          <button
                            onClick={() => {
                              const newTasks = exp.tasks.filter((_, i) => i !== tidx);
                              updateItem('experience', idx, 'tasks', newTasks);
                            }}
                            className="p-1 text-gray-300 hover:text-red-500 h-fit mt-0.5"
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

                  {/* Archived tasks section */}
                  {archived.length > 0 && (
                    <div className="border-t border-dashed border-amber-200 dark:border-amber-800/40 pt-3 space-y-2">
                      <button
                        onClick={() => setShowArchived(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest"
                      >
                        <Archive size={11} />
                        {showArchived[idx] ? 'Ocultar' : 'Ver'} archivo ({archived.length} {archived.length === 1 ? 'tarea' : 'tareas'})
                        <ChevronRight size={11} className={`transition-transform ${showArchived[idx] ? 'rotate-90' : ''}`} />
                      </button>
                      {showArchived[idx] && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          {archived.map((archivedTask, aidx) => (
                            <div key={aidx} className="flex gap-2 items-start bg-amber-50/50 dark:bg-amber-900/10 border border-dashed border-amber-200 dark:border-amber-800/40 rounded-lg p-2">
                              <p className="flex-1 text-xs text-amber-700 dark:text-amber-400 leading-relaxed opacity-80 min-w-0 break-words">{archivedTask}</p>
                              <button
                                onClick={() => restoreTask(idx, aidx)}
                                className="p-1 text-amber-500 hover:text-teal-500 flex-shrink-0 transition-colors"
                                title="Restaurar al CV"
                              >
                                <RotateCcw size={12} />
                              </button>
                              <button
                                onClick={() => deleteArchivedTask(idx, aidx)}
                                className="p-1 text-amber-400 hover:text-red-500 flex-shrink-0 transition-colors"
                                title="Eliminar permanentemente"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </EditorFormSection>
  );
};
