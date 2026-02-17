import React, { useState } from 'react';
import { Layout, Eye, EyeOff, GripVertical } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';

interface SectionManagerProps {
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  data,
  updateField
}) => {
  const [dragged, setDragged] = useState<{idx: number, col: 'left' | 'right'} | null>(null);

  const toggleSectionVisibility = (section: string) => {
    const hidden = data.hiddenSections || [];
    const isHidden = hidden.includes(section);
    const newHidden = isHidden 
      ? hidden.filter(s => s !== section)
      : [...hidden, section];
    updateField('hiddenSections', newHidden);
  };

  const handleDragStart = (e: React.DragEvent, index: number, col: 'left' | 'right') => {
    setDragged({ idx: index, col });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number, col: 'left' | 'right') => {
    e.preventDefault();
    if (!dragged) return;

    const layout = data.columnLayout || {
      left: ['experience', 'education'],
      right: ['skills', 'courses', 'languages', 'interests']
    };

    const newLayout = { ...layout };
    const sourceList = [...newLayout[dragged.col]];
    const [movedItem] = sourceList.splice(dragged.idx, 1);

    if (dragged.col === col) {
      sourceList.splice(index, 0, movedItem);
      newLayout[col] = sourceList;
    } else {
      const targetList = [...newLayout[col]];
      targetList.splice(index, 0, movedItem);
      newLayout[dragged.col] = sourceList;
      newLayout[col] = targetList;
    }

    updateField('columnLayout', newLayout);
    setDragged({ idx: index, col });
  };

  const renderManagerItem = (section: string, idx: number, col: 'left' | 'right') => {
    const isHidden = data.hiddenSections?.includes(section);
    const labels: Record<string, string> = {
      experience: 'Experiencia',
      education: 'Educación',
      skills: 'Habilidades',
      courses: 'Cursos',
      languages: 'Idiomas',
      interests: 'Intereses'
    };

    return (
      <div 
        key={section}
        draggable={!isHidden}
        onDragStart={(e) => handleDragStart(e, idx, col)}
        onDragOver={(e) => handleDragOver(e, idx, col)}
        onDragEnd={() => setDragged(null)}
        className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${
          isHidden 
            ? 'bg-gray-50 dark:bg-zinc-950/30 border-dashed border-gray-200 dark:border-zinc-800 opacity-60' 
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-md hover:border-teal-500/30 cursor-grab active:cursor-grabbing'
        } ${dragged?.idx === idx && dragged?.col === col ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex items-center gap-2.5">
          {!isHidden && <GripVertical size={14} className="text-gray-300 group-hover:text-teal-500 transition-colors" />}
          <span className={`text-[11px] font-black uppercase tracking-wider ${isHidden ? 'text-gray-400' : 'text-gray-700 dark:text-zinc-300'}`}>
            {labels[section]}
          </span>
        </div>
        <button 
          onClick={() => toggleSectionVisibility(section)}
          className={`p-1.5 rounded-lg transition-all ${
            isHidden ? 'text-gray-400 hover:text-teal-500 bg-gray-100 dark:bg-zinc-800' : 'text-teal-600 dark:text-teal-400 bg-teal-500/5 hover:bg-teal-500/10'
          }`}
        >
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    );
  };

  return (
    <EditorFormSection title="Gestor de Columnas" subtitle="Arrastra para reordenar secciones" icon={Layout}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Columna Izquierda</label>
          <div className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[100px]">
            {(data.columnLayout?.left || ['experience', 'education']).map((s, i) => renderManagerItem(s, i, 'left'))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Columna Derecha</label>
          <div className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[100px]">
            {(data.columnLayout?.right || ['skills', 'courses', 'languages', 'interests']).map((s, i) => renderManagerItem(s, i, 'right'))}
          </div>
        </div>
      </div>
    </EditorFormSection>
  );
};
