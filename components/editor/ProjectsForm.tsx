import React, { useState } from 'react';
import { FolderGit2, Plus, Minus, Trash2, GripVertical, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { ResumeData, ProjectItem } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface ProjectsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  if (data.hiddenSections?.includes('projects')) return null;

  const projects = data.projects || [];

  const updateProject = (idx: number, field: keyof ProjectItem, value: any) => {
    const newList = [...projects];
    newList[idx] = { ...newList[idx], [field]: value };
    onChange({ ...data, projects: newList });
  };

  const addProject = () => {
    onChange({ ...data, projects: [{ title: '', description: '', technologies: [], githubUrl: '', demoUrl: '' }, ...projects] });
  };

  const removeProject = (idx: number) => {
    onChange({ ...data, projects: projects.filter((_, i) => i !== idx) });
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const list = [...projects];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(idx, 0, moved);
    onChange({ ...data, projects: list });
    setDraggedIdx(idx);
  };

  return (
    <EditorFormSection
      title="Proyectos"
      subtitle="Proyectos destacados de tu portafolio"
      icon={FolderGit2}
      onAdd={addProject}
    >
      <div className="space-y-3">
        {projects.map((proj, idx) => {
          const isCollapsed = collapsed[idx] ?? false;
          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={() => setDraggedIdx(null)}
              className={`rounded-xl border transition-all ${draggedIdx === idx ? 'opacity-0 scale-95' : proj.hidden ? 'opacity-60 border-dashed border-amber-200 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-900/5' : 'bg-gray-50/50 dark:bg-zinc-950/50 border-gray-100 dark:border-zinc-800'}`}
            >
              <div className="flex items-center gap-2 px-4 pt-3 pb-3 cursor-pointer select-none" onClick={() => setCollapsed(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                <ChevronRight size={14} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate block">{proj.title || <span className="text-gray-400 italic font-normal">Sin título</span>}</span>
                  {proj.technologies.length > 0 && <span className="text-[10px] text-gray-400 dark:text-zinc-500 truncate block">{proj.technologies.slice(0, 3).join(', ')}</span>}
                </div>
                <div className="flex gap-0.5 items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-0.5 items-center bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm">
                    <div className="p-1.5 text-gray-300 cursor-grab hover:text-teal-500 transition-colors"><GripVertical size={14} /></div>
                    <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-0.5" />
                    <button onClick={() => updateProject(idx, 'hidden', !proj.hidden)} className={`p-1.5 transition-colors ${proj.hidden ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`} title={proj.hidden ? 'Mostrar' : 'Ocultar'}>
                      {proj.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-0.5" />
                    <button onClick={() => removeProject(idx)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>

              {!isCollapsed && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Nombre del Proyecto</label>
                    <AutoResizeTextarea value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal" placeholder="Mi Proyecto Increíble" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Descripción</label>
                    <AutoResizeTextarea value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal" placeholder="Describe el proyecto, sus objetivos y resultados..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">GitHub URL</label>
                      <input value={proj.githubUrl || ''} onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none" placeholder="github.com/user/repo" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Demo URL</label>
                      <input value={proj.demoUrl || ''} onChange={(e) => updateProject(idx, 'demoUrl', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none" placeholder="miproyecto.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1 block">Tecnologías</label>
                    {proj.technologies.map((tech, ti) => (
                      <div key={ti} className="flex gap-2 items-center">
                        <input value={tech} onChange={(e) => { const t = [...proj.technologies]; t[ti] = e.target.value; updateProject(idx, 'technologies', t); }} className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none" placeholder="React, TypeScript..." />
                        <button onClick={() => { const t = proj.technologies.filter((_, i) => i !== ti); updateProject(idx, 'technologies', t); }} className="p-1 text-gray-300 hover:text-red-500"><Minus size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => updateProject(idx, 'technologies', [...proj.technologies, ''])} className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 uppercase tracking-widest pl-1 pt-1">
                      <Plus size={10} /> Añadir Tecnología
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </EditorFormSection>
  );
};
