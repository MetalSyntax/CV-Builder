import React, { useState } from 'react';
import { Zap, Plus, Minus, GripVertical } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';

interface SkillsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  updateField: (field: keyof ResumeData, value: any) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({
  data,
  onChange,
  addItem,
  updateField
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  if (data.hiddenSections?.includes('skills')) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const list = [...data.skills];
    const [movedItem] = list.splice(draggedIdx, 1);
    list.splice(index, 0, movedItem);
    
    updateField('skills', list);
    setDraggedIdx(index);
  };

  return (
    <EditorFormSection 
      title="Habilidades" 
      subtitle="Tus puntos fuertes y herramientas" 
      icon={Zap}
      onAdd={() => addItem('skills', '')}
    >
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, idx) => (
          <div 
            key={idx} 
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDraggedIdx(null)}
            className={`flex gap-1 items-center bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-lg p-1.5 transition-all focus-within:ring-1 focus-within:ring-teal-500/30 group cursor-grab active:cursor-grabbing ${draggedIdx === idx ? 'opacity-0 scale-95' : 'opacity-100'}`}
          >
            <GripVertical size={10} className="text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
            <input 
              value={skill} 
              onChange={(e) => {
                const list = [...data.skills];
                list[idx] = e.target.value;
                updateField('skills', list);
              }}
              className="bg-transparent text-[10px] font-bold text-gray-700 dark:text-zinc-300 outline-none px-1 w-24"
              placeholder="Habilidad"
            />
            <button 
              onClick={() => {
                const list = data.skills.filter((_, i) => i !== idx);
                updateField('skills', list);
              }}
              className="p-0.5 text-gray-300 hover:text-red-500 rounded"
            >
              <Minus size={12} />
            </button>
          </div>
        ))}
      </div>
    </EditorFormSection>
  );
};
