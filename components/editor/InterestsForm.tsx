import React, { useState } from 'react';
import { Heart, Plus, Minus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';

interface InterestsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  updateField: (field: keyof ResumeData, value: any) => void;
}

export const InterestsForm: React.FC<InterestsFormProps> = ({
  data,
  onChange,
  addItem,
  updateField
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  if (data.hiddenSections?.includes('interests')) return null;

  return (
    <EditorFormSection 
      title="Intereses" 
      subtitle="Lo que te apasiona fuera del trabajo" 
      icon={Heart}
      onAdd={() => addItem('interests', '')}
    >
      <div className="flex flex-wrap gap-2">
        {data.interests.map((interest, idx) => {
          const isHidden = (data.hiddenInterests || []).includes(idx);

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

                const list = [...data.interests];
                const [moved] = list.splice(draggedIdx, 1);
                list.splice(idx, 0, moved);

                // Adjust hidden interests indices
                const hidden = data.hiddenInterests || [];
                const newHidden = hidden.map(hIdx => {
                  if (hIdx === draggedIdx) return idx;
                  if (draggedIdx < idx) {
                    if (hIdx > draggedIdx && hIdx <= idx) return hIdx - 1;
                  } else {
                    if (hIdx >= idx && hIdx < draggedIdx) return hIdx + 1;
                  }
                  return hIdx;
                });

                onChange({ ...data, interests: list, hiddenInterests: newHidden });
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
                value={interest}
                onChange={(e) => {
                  const list = [...data.interests];
                  list[idx] = e.target.value;
                  updateField('interests', list);
                }}
                className="bg-transparent text-[10px] font-bold text-gray-700 dark:text-zinc-300 outline-none px-1 w-24"
                placeholder="Interés"
              />
              <button
                onClick={() => {
                  const hidden = data.hiddenInterests || [];
                  const newHidden = isHidden
                    ? hidden.filter(i => i !== idx)
                    : [...hidden, idx];
                  onChange({ ...data, hiddenInterests: newHidden });
                }}
                className={`p-0.5 rounded transition-colors ${isHidden ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}`}
                title={isHidden ? 'Mostrar en CV' : 'Ocultar del CV'}
              >
                {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button
                onClick={() => {
                  const list = data.interests.filter((_, i) => i !== idx);
                  const hidden = (data.hiddenInterests || [])
                    .filter(i => i !== idx)
                    .map(i => (i > idx ? i - 1 : i));
                  
                  onChange({ ...data, interests: list, hiddenInterests: hidden });
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
