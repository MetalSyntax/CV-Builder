import React, { useEffect, useMemo } from 'react';
import { Heart, Plus, Minus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';

interface InterestsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  updateField: (field: keyof ResumeData, value: any) => void;
}

interface InterestItem {
  _id: string;
  value: string;
  isHidden: boolean;
  originalIndex: number;
}

export const InterestsForm: React.FC<InterestsFormProps> = ({
  data,
  onChange,
  addItem,
  updateField
}) => {
  if (data.hiddenSections?.includes('interests')) return null;

  const idMap = React.useRef(new Map<number, string>());
  
  const mappedInterests = data.interests.map((s, i) => {
    if (!idMap.current.has(i)) idMap.current.set(i, Math.random().toString(36).substr(2, 9));
    return {
      _id: idMap.current.get(i)!,
      value: s,
      isHidden: (data.hiddenInterests || []).includes(i),
      originalIndex: i
    };
  });

  const [parentRef, items, setItems] = useDragAndDrop<HTMLDivElement, any>(mappedInterests, {
    dragHandle: '.drag-handle'
  });

  React.useEffect(() => {
    const currentValues = items.map((i: any) => i.value);
    const currentHidden = items.map((i: any) => i.isHidden);
    
    if (JSON.stringify(currentValues) !== JSON.stringify(data.interests) || 
        JSON.stringify(currentHidden) !== JSON.stringify((data.hiddenInterests || []).map(i => currentValues[i] ? true : false))) {
      setItems(mappedInterests);
    }
  }, [data.interests, data.hiddenInterests]);

  React.useEffect(() => {
    const sortedValues = items.map((i: any) => i.value);
    const sortedHidden = items.map((i: any, idx: number) => i.isHidden ? idx : -1).filter((i: number) => i !== -1);
    
    if (JSON.stringify(sortedValues) !== JSON.stringify(data.interests) || 
        JSON.stringify(sortedHidden) !== JSON.stringify(data.hiddenInterests || [])) {
      updateField('interests', sortedValues);
      updateField('hiddenInterests', sortedHidden);
    }
  }, [items]);

  return (
    <EditorFormSection 
      title="Intereses" 
      subtitle="Lo que te apasiona fuera del trabajo" 
      icon={Heart}
      onAdd={() => addItem('interests', '')}
    >
      <div ref={parentRef} className="flex flex-wrap gap-2">
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
                  const list = [...data.interests];
                  list[localIdx] = e.target.value;
                  updateField('interests', list);
                }}
                className="bg-transparent text-[10px] font-bold text-gray-700 dark:text-zinc-300 outline-none px-1 w-24"
                placeholder="Interés"
              />
              <button
                onClick={() => {
                  const hidden = data.hiddenInterests || [];
                  const newHidden = item.isHidden
                    ? hidden.filter(i => i !== localIdx)
                    : [...hidden, localIdx];
                  onChange({ ...data, hiddenInterests: newHidden });
                }}
                className={`p-0.5 rounded transition-colors ${item.isHidden ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}`}
                title={item.isHidden ? 'Mostrar en CV' : 'Ocultar del CV'}
              >
                {item.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button
                onClick={() => {
                  const list = data.interests.filter((_, i) => i !== localIdx);
                  const hidden = (data.hiddenInterests || [])
                    .filter(i => i !== localIdx)
                    .map(i => (i > localIdx ? i - 1 : i));
                  idMap.current.clear();
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
