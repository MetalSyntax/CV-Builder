import React, { useState } from 'react';
import { Zap, Plus, Minus, GripVertical, Eye, EyeOff } from 'lucide-react';
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

  return (
    <EditorFormSection 
      title="Habilidades" 
      subtitle="Tus puntos fuertes y herramientas" 
      icon={Zap}
      onAdd={() => addItem('skills', '')}
    >
      <div className="grid grid-cols-2 gap-2">
        {data.skills.map((skill, idx) => {
          const isHidden = (data.hiddenSkills || []).includes(idx);

          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => {
                setDraggedIdx(idx);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx === null || draggedIdx === idx) return;

                const list = [...data.skills];
                const [moved] = list.splice(draggedIdx, 1);
                list.splice(idx, 0, moved);

                // Adjust hidden skills indices
                const hidden = data.hiddenSkills || [];
                const newHidden = hidden.map(hIdx => {
                  if (hIdx === draggedIdx) return idx;
                  if (draggedIdx < idx) {
                    if (hIdx > draggedIdx && hIdx <= idx) return hIdx - 1;
                  } else {
                    if (hIdx >= idx && hIdx < draggedIdx) return hIdx + 1;
                  }
                  return hIdx;
                });

                onChange({ ...data, skills: list, hiddenSkills: newHidden });
                setDraggedIdx(idx);
              }}
              onDragEnd={() => setDraggedIdx(null)}
              className={`flex gap-1 items-center rounded-lg p-1.5 transition-all focus-within:ring-1 focus-within:ring-teal-500/30 group
                ${draggedIdx === idx ? 'opacity-0 scale-95' : ''}
                ${isHidden ? 'opacity-50' : 'opacity-100'}
                ${isHidden
                  ? 'bg-amber-50/30 dark:bg-amber-900/5 border border-dashed border-amber-200 dark:border-amber-800/40'
                  : 'bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800'
                }`}
            >
              <GripVertical size={10} className="drag-handle text-gray-300 group-hover:text-teal-500 transition-colors shrink-0 cursor-grab active:cursor-grabbing" />
              <input
                value={skill}
                onChange={(e) => {
                  const list = [...data.skills];
                  list[idx] = e.target.value;
                  updateField('skills', list);
                }}
                className="bg-transparent text-[10px] font-bold text-gray-700 dark:text-zinc-300 outline-none px-1 flex-1 min-w-0"
                placeholder="Habilidad"
              />
              <button
                onClick={() => {
                  const hidden = data.hiddenSkills || [];
                  const newHidden = isHidden
                    ? hidden.filter(i => i !== idx)
                    : [...hidden, idx];
                  onChange({ ...data, hiddenSkills: newHidden });
                }}
                className={`p-0.5 rounded transition-colors ${isHidden ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}`}
                title={isHidden ? 'Mostrar en CV' : 'Ocultar del CV'}
              >
                {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button
                onClick={() => {
                  const list = data.skills.filter((_, i) => i !== idx);
                  const hidden = (data.hiddenSkills || [])
                    .filter(i => i !== idx)
                    .map(i => (i > idx ? i - 1 : i));
                  
                  onChange({ ...data, skills: list, hiddenSkills: hidden });
                }}
                className="p-0.5 text-gray-300 hover:text-red-500 rounded"
              >
                <Minus size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </EditorFormSection>
  );
};
