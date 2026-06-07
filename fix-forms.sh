#!/bin/bash
# Revert to a simpler useDragAndDrop approach for SkillsForm and InterestsForm

cat << 'INNER_EOF' > components/editor/SkillsForm.tsx
import React, { useEffect, useRef } from 'react';
import { Zap, Plus, Minus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';

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
  if (data.hiddenSections?.includes('skills')) return null;

  // We map the skills to objects with stable IDs using a ref to prevent focus loss
  const idMap = useRef(new Map<number, string>());
  
  const mappedSkills = data.skills.map((s, i) => {
    if (!idMap.current.has(i)) idMap.current.set(i, Math.random().toString(36).substr(2, 9));
    return {
      _id: idMap.current.get(i)!,
      value: s,
      isHidden: (data.hiddenSkills || []).includes(i),
      originalIndex: i
    };
  });

  const [parentRef, items, setItems] = useDragAndDrop<HTMLDivElement, any>(mappedSkills, {
    dragHandle: '.drag-handle'
  });

  useEffect(() => {
    // Check if items changed from external update
    const currentValues = items.map((i: any) => i.value);
    const currentHidden = items.map((i: any) => i.isHidden);
    
    if (JSON.stringify(currentValues) !== JSON.stringify(data.skills) || 
        JSON.stringify(currentHidden) !== JSON.stringify((data.hiddenSkills || []).map(i => currentValues[i] ? true : false))) {
      setItems(mappedSkills);
    }
  }, [data.skills, data.hiddenSkills]);

  useEffect(() => {
    // When sorted, update parent
    const sortedValues = items.map((i: any) => i.value);
    const sortedHidden = items.map((i: any, idx: number) => i.isHidden ? idx : -1).filter((i: number) => i !== -1);
    
    if (JSON.stringify(sortedValues) !== JSON.stringify(data.skills) || 
        JSON.stringify(sortedHidden) !== JSON.stringify(data.hiddenSkills || [])) {
      updateField('skills', sortedValues);
      updateField('hiddenSkills', sortedHidden);
    }
  }, [items]);

  return (
    <EditorFormSection 
      title="Habilidades" 
      subtitle="Tus puntos fuertes y herramientas" 
      icon={Zap}
      onAdd={() => addItem('skills', '')}
    >
      <div ref={parentRef} className="grid grid-cols-2 gap-2">
        {items.map((item: any, localIdx: number) => {
          return (
            <div
              key={item._id}
              className={`flex gap-1 items-center rounded-lg p-1.5 transition-all focus-within:ring-1 focus-within:ring-teal-500/30 group
                ${item.isHidden ? 'opacity-50' : 'opacity-100'}
                ${item.isHidden
                  ? 'bg-amber-50/30 dark:bg-amber-900/5 border border-dashed border-amber-200 dark:border-amber-800/40'
                  : 'bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800'
                }`}
            >
              <GripVertical size={10} className="drag-handle text-gray-300 group-hover:text-teal-500 transition-colors shrink-0 cursor-grab active:cursor-grabbing" />
              <input
                value={item.value}
                onChange={(e) => {
                  const list = [...data.skills];
                  list[localIdx] = e.target.value;
                  updateField('skills', list);
                }}
                className="bg-transparent text-[10px] font-bold text-gray-700 dark:text-zinc-300 outline-none px-1 flex-1 min-w-0"
                placeholder="Habilidad"
              />
              <button
                onClick={() => {
                  const hidden = data.hiddenSkills || [];
                  const newHidden = item.isHidden
                    ? hidden.filter(i => i !== localIdx)
                    : [...hidden, localIdx];
                  onChange({ ...data, hiddenSkills: newHidden });
                }}
                className={`p-0.5 rounded transition-colors ${item.isHidden ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}`}
                title={item.isHidden ? 'Mostrar en CV' : 'Ocultar del CV'}
              >
                {item.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button
                onClick={() => {
                  const list = data.skills.filter((_, i) => i !== localIdx);
                  const hidden = (data.hiddenSkills || [])
                    .filter(i => i !== localIdx)
                    .map(i => (i > localIdx ? i - 1 : i));
                  
                  // cleanup ref map
                  idMap.current.clear();
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
INNER_EOF

