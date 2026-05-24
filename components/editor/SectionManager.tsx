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
  const defaultLeft = ['experience', 'education'];
  const defaultRight = ['skills', 'courses', 'languages', 'interests', 'projects'];

  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [draggedSourceCol, setDraggedSourceCol] = useState<'left' | 'right' | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const toggleSectionVisibility = (section: string) => {
    const hidden = data.hiddenSections || [];
    const isHidden = hidden.includes(section);
    const newHidden = isHidden 
      ? hidden.filter(s => s !== section)
      : [...hidden, section];
    updateField('hiddenSections', newHidden);
  };

  const handleDragStart = (e: React.DragEvent, section: string, col: 'left' | 'right') => {
    setDraggedSection(section);
    setDraggedSourceCol(col);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e: React.DragEvent, targetSection: string, targetCol: 'left' | 'right') => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSection) return;

    const left = [...(data.columnLayout?.left || defaultLeft)];
    const right = [...(data.columnLayout?.right || defaultRight)];

    // Remove from source
    if (draggedSourceCol === 'left') {
      const idx = left.indexOf(draggedSection);
      if (idx !== -1) left.splice(idx, 1);
    } else {
      const idx = right.indexOf(draggedSection);
      if (idx !== -1) right.splice(idx, 1);
    }

    // Insert into target at the target item's position
    if (targetCol === 'left') {
      const idx = left.indexOf(targetSection);
      if (idx !== -1) {
        left.splice(idx, 0, draggedSection);
      } else {
        left.push(draggedSection);
      }
    } else {
      const idx = right.indexOf(targetSection);
      if (idx !== -1) {
        right.splice(idx, 0, draggedSection);
      } else {
        right.push(draggedSection);
      }
    }

    updateField('columnLayout', { left, right });
    setDraggedSourceCol(targetCol);
  };

  const handleDragOverColumn = (e: React.DragEvent, targetCol: 'left' | 'right') => {
    e.preventDefault();
    if (!draggedSection) return;

    const left = [...(data.columnLayout?.left || defaultLeft)];
    const right = [...(data.columnLayout?.right || defaultRight)];

    // If it's the only item in target, check if it's already there
    if (targetCol === 'left' && left.includes(draggedSection)) return;
    if (targetCol === 'right' && right.includes(draggedSection)) return;

    // Remove from source
    if (draggedSourceCol === 'left') {
      const idx = left.indexOf(draggedSection);
      if (idx !== -1) left.splice(idx, 1);
    } else {
      const idx = right.indexOf(draggedSection);
      if (idx !== -1) right.splice(idx, 1);
    }

    // Push to target
    if (targetCol === 'left') {
      left.push(draggedSection);
    } else {
      right.push(draggedSection);
    }

    updateField('columnLayout', { left, right });
    setDraggedSourceCol(targetCol);
  };

  const renderManagerItem = (section: string, col: 'left' | 'right') => {
    const isHidden = data.hiddenSections?.includes(section);
    const labels: Record<string, string> = {
      experience: 'Experiencia',
      education: 'Educación',
      skills: 'Habilidades',
      courses: 'Cursos',
      languages: 'Idiomas',
      interests: 'Intereses',
      projects: 'Proyectos',
    };

    return (
      <div
        key={section}
        onDragOver={(e) => handleDragOverItem(e, section, col)}
        className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${
          draggedSection === section ? 'opacity-0 scale-95' : ''
        } ${
          isHidden
            ? 'bg-gray-50 dark:bg-zinc-950/30 border-dashed border-gray-200 dark:border-zinc-800 opacity-60'
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-md hover:border-teal-500/30'
        }`}
      >
        <div
          className={`flex items-center gap-2.5 flex-1 min-w-0 ${!isHidden ? 'cursor-grab active:cursor-grabbing' : ''}`}
          draggable={!isHidden}
          onDragStart={!isHidden ? (e) => handleDragStart(e, section, col) : undefined}
          onDragEnd={!isHidden ? () => { setDraggedSection(null); setDraggedSourceCol(null); } : undefined}
        >
          {!isHidden && <GripVertical size={14} className="text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />}
          {editingSection === section ? (
            <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => {
                  if (editingName.trim()) {
                    updateField('sectionNames', { ...(data.sectionNames || {}), [section]: editingName.trim() });
                  }
                  setEditingSection(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (editingName.trim()) updateField('sectionNames', { ...(data.sectionNames || {}), [section]: editingName.trim() });
                    setEditingSection(null);
                  }
                  if (e.key === 'Escape') setEditingSection(null);
                }}
                className="flex-1 min-w-0 text-[11px] font-black bg-white dark:bg-zinc-800 border border-teal-500 rounded px-1.5 py-0.5 text-teal-600 outline-none uppercase tracking-wide"
              />
            </div>
          ) : (
            <span
              className={`text-[11px] font-black uppercase tracking-wider truncate ${isHidden ? 'text-gray-400' : 'text-gray-700 dark:text-zinc-300'}`}
              onDoubleClick={() => {
                setEditingSection(section);
                setEditingName((data.sectionNames || {})[section] || labels[section] || section);
              }}
              title="Doble clic para renombrar"
            >
              {(data.sectionNames || {})[section] || labels[section] || section}
            </span>
          )}
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSectionVisibility(section);
          }}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
            isHidden ? 'text-gray-400 hover:text-teal-500 bg-gray-100 dark:bg-zinc-800' : 'text-teal-600 dark:text-teal-400 bg-teal-500/5 hover:bg-teal-500/10'
          }`}
        >
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    );
  };

  const leftItems = data.columnLayout?.left || defaultLeft;
  const rightItems = data.columnLayout?.right || defaultRight;

  return (
    <EditorFormSection title="Gestor de Columnas" subtitle="Arrastra para reordenar secciones" icon={Layout}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Columna Izquierda</label>
          <div 
            onDragOver={(e) => handleDragOverColumn(e, 'left')}
            className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[150px]"
          >
            {leftItems.map(s => renderManagerItem(s, 'left'))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Columna Derecha</label>
          <div 
            onDragOver={(e) => handleDragOverColumn(e, 'right')}
            className="bg-gray-50/50 dark:bg-zinc-950/20 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-2 min-h-[150px]"
          >
            {rightItems.map(s => renderManagerItem(s, 'right'))}
          </div>
        </div>
      </div>
      {(data.customSections || []).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1 block mb-2">Secciones Personalizadas</label>
          <div className="space-y-1.5">
            {(data.customSections || []).map(cs => {
              const sectionId = `custom-${cs.id}`;
              const inLayout = [...(data.columnLayout?.left || []), ...(data.columnLayout?.right || [])].includes(sectionId);
              return (
                <div key={cs.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 truncate">{cs.title}</span>
                  <button
                    onClick={() => {
                      const left = [...(data.columnLayout?.left || ['experience', 'education'])];
                      const right = [...(data.columnLayout?.right || ['skills', 'courses', 'languages', 'interests'])];
                      if (inLayout) {
                        const newLeft = left.filter(s => s !== sectionId);
                        const newRight = right.filter(s => s !== sectionId);
                        updateField('columnLayout', { left: newLeft, right: newRight });
                      } else {
                        right.push(sectionId);
                        updateField('columnLayout', { left, right });
                      }
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${inLayout ? 'bg-teal-500/10 text-teal-600 hover:bg-red-50 hover:text-red-500' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:bg-teal-500/10 hover:text-teal-600'}`}
                  >
                    {inLayout ? 'Quitar' : 'Añadir'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </EditorFormSection>
  );
};
