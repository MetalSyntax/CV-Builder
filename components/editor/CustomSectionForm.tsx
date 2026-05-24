import React, { useState } from 'react';
import { Layers, Plus, Minus, Trash2, GripVertical, Eye, EyeOff, ChevronRight, Edit3, Check, X } from 'lucide-react';
import { ResumeData, CustomSection, CustomSectionItem } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface CustomSectionFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ data, onChange }) => {
  const [collapsed, setCollapsed] = useState<Record<string, Record<number, boolean>>>({});
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState('');

  const sections = data.customSections || [];

  const addSection = () => {
    const id = crypto.randomUUID();
    const newSection: CustomSection = { id, title: 'Nueva Sección', items: [{ title: '', description: '', date: '', location: '' }], hidden: false };
    onChange({ ...data, customSections: [...sections, newSection] });
    setEditingTitle(id);
    setTitleDraft('Nueva Sección');
  };

  const updateSection = (id: string, updates: Partial<CustomSection>) => {
    onChange({ ...data, customSections: sections.map(s => s.id === id ? { ...s, ...updates } : s) });
  };

  const removeSection = (id: string) => {
    onChange({ ...data, customSections: sections.filter(s => s.id !== id) });
  };

  const updateItem = (sectionId: string, itemIdx: number, field: keyof CustomSectionItem, value: string) => {
    onChange({ ...data, customSections: sections.map(s => {
      if (s.id !== sectionId) return s;
      const newItems = s.items.map((item, i) => i === itemIdx ? { ...item, [field]: value } : item);
      return { ...s, items: newItems };
    })});
  };

  const addItem = (sectionId: string) => {
    onChange({ ...data, customSections: sections.map(s => s.id === sectionId ? { ...s, items: [...s.items, { title: '', description: '', date: '', location: '' }] } : s) });
  };

  const removeItem = (sectionId: string, itemIdx: number) => {
    onChange({ ...data, customSections: sections.map(s => s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== itemIdx) } : s) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Secciones Personalizadas</span>
        <button onClick={addSection} className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 uppercase tracking-widest">
          <Plus size={12} /> Nueva Sección
        </button>
      </div>

      {sections.map((section) => {
        const sectionCollapsed = collapsed[section.id] || {};
        return (
          <div key={section.id} className={`rounded-xl border ${section.hidden ? 'opacity-60 border-dashed border-amber-200 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-900/5' : 'bg-white dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'}`}>
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 py-3">
              {editingTitle === section.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input autoFocus value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { updateSection(section.id, { title: titleDraft }); setEditingTitle(null); } if (e.key === 'Escape') setEditingTitle(null); }} className="flex-1 bg-white dark:bg-zinc-800 border border-teal-500 rounded-lg px-2 py-1 text-xs font-bold text-teal-600 outline-none" />
                  <button onClick={() => { updateSection(section.id, { title: titleDraft }); setEditingTitle(null); }} className="p-1 text-teal-500 hover:text-teal-600"><Check size={14} /></button>
                  <button onClick={() => setEditingTitle(null)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-wide">{section.title}</span>
                  <button onClick={() => { setEditingTitle(section.id); setTitleDraft(section.title); }} className="p-1.5 text-gray-300 hover:text-teal-500 transition-colors" title="Renombrar"><Edit3 size={13} /></button>
                  <button onClick={() => updateSection(section.id, { hidden: !section.hidden })} className={`p-1.5 transition-colors ${section.hidden ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}>
                    {section.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => removeSection(section.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </>
              )}
            </div>

            {/* Items */}
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-zinc-800">
              {section.items.map((item, i) => {
                const isCollapsed = sectionCollapsed[i] ?? false;
                return (
                  <div key={i} className="pt-3">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCollapsed(prev => ({ ...prev, [section.id]: { ...(prev[section.id] || {}), [i]: !isCollapsed } }))}>
                      <ChevronRight size={12} className={`text-gray-400 flex-shrink-0 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
                      <span className="flex-1 text-[11px] font-bold text-gray-600 dark:text-zinc-400 truncate">{item.title || <span className="italic font-normal text-gray-400">Elemento {i + 1}</span>}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeItem(section.id, i); }} className="p-1 text-gray-300 hover:text-red-500"><Minus size={12} /></button>
                    </div>
                    {!isCollapsed && (
                      <div className="mt-2 space-y-2 pl-5">
                        <AutoResizeTextarea value={item.title || ''} onChange={(e) => updateItem(section.id, i, 'title', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-800 dark:text-white focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal" placeholder="Título del elemento" />
                        <AutoResizeTextarea value={item.description || ''} onChange={(e) => updateItem(section.id, i, 'description', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none leading-normal" placeholder="Descripción..." />
                        <div className="grid grid-cols-2 gap-2">
                          <input value={item.date || ''} onChange={(e) => updateItem(section.id, i, 'date', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none" placeholder="Fecha" />
                          <input value={item.location || ''} onChange={(e) => updateItem(section.id, i, 'location', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-teal-500/30 outline-none" placeholder="Ubicación" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <button onClick={() => addItem(section.id)} className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 uppercase tracking-widest pt-1">
                <Plus size={10} /> Añadir Elemento
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
