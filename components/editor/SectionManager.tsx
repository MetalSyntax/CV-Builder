import React, { useEffect } from 'react';
import { Layout, Eye, EyeOff, GripVertical } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';

interface SectionManagerProps {
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  data,
  updateField
}) => {
  const defaultLeft = ['experience', 'education'];
  const defaultRight = ['skills', 'courses', 'languages', 'interests'];

  const [leftRef, leftItems, setLeftItems] = useDragAndDrop<HTMLDivElement, string>(
    data.columnLayout?.left || defaultLeft, 
    { group: 'layoutGroup' }
  );
  
  const [rightRef, rightItems, setRightItems] = useDragAndDrop<HTMLDivElement, string>(
    data.columnLayout?.right || defaultRight, 
    { group: 'layoutGroup' }
  );

  useEffect(() => {
    const l = data.columnLayout?.left || defaultLeft;
    const r = data.columnLayout?.right || defaultRight;
    
    if (JSON.stringify(leftItems) !== JSON.stringify(l)) setLeftItems(l);
    if (JSON.stringify(rightItems) !== JSON.stringify(r)) setRightItems(r);
  }, [data.columnLayout]);

  useEffect(() => {
    const l = data.columnLayout?.left || defaultLeft;
    const r = data.columnLayout?.right || defaultRight;
    
    // Calculate total items to ensure no items are dropped mid-transfer
    if ((leftItems.length + rightItems.length) === (l.length + r.length)) {
      if (JSON.stringify(leftItems) !== JSON.stringify(l) || JSON.stringify(rightItems) !== JSON.stringify(r)) {
        updateField('columnLayout', { left: leftItems, right: rightItems });
      }
    }
  }, [leftItems, rightItems]);

  const toggleSectionVisibility = (section: string) => {
    const hidden = data.hiddenSections || [];
    const isHidden = hidden.includes(section);
    const newHidden = isHidden 
      ? hidden.filter(s => s !== section)
      : [...hidden, section];
    updateField('hiddenSections', newHidden);
  };

  const renderManagerItem = (section: string) => {
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
        className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${
          isHidden 
            ? 'bg-gray-50 dark:bg-zinc-950/30 border-dashed border-gray-200 dark:border-zinc-800 opacity-60' 
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-md hover:border-teal-500/30 cursor-grab active:cursor-grabbing'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {!isHidden && <GripVertical size={14} className="text-gray-300 group-hover:text-teal-500 transition-colors" />}
          <span className={`text-[11px] font-black uppercase tracking-wider ${isHidden ? 'text-gray-400' : 'text-gray-700 dark:text-zinc-300'}`}>
            {labels[section]}
          </span>
        </div>
        <button 
          onPointerDown={(e) => {
             // Stop propagation so it doesn't trigger drag
             e.stopPropagation();
             toggleSectionVisibility(section);
          }}
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
          <div ref={leftRef} className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[100px]">
            {leftItems.map(s => renderManagerItem(s))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Columna Derecha</label>
          <div ref={rightRef} className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[100px]">
            {rightItems.map(s => renderManagerItem(s))}
          </div>
        </div>
      </div>
    </EditorFormSection>
  );
};
