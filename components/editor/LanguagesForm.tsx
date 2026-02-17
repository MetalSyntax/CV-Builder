import React, { useState } from 'react';
import { Globe, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';

interface LanguagesFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onMoveItem: (field: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  addItem: <T>(field: keyof ResumeData, initialItem: T) => void;
  removeItem: (field: keyof ResumeData, index: number) => void;
  updateItem: (field: keyof ResumeData, index: number, itemField: string, value: any) => void;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({
  data,
  onChange,
  onMoveItem,
  addItem,
  removeItem,
  updateItem
}) => {
  const [openLevelIdx, setOpenLevelIdx] = useState<number | null>(null);

  if (data.hiddenSections?.includes('languages')) return null;

  return (
    <EditorFormSection 
      title="Idiomas" 
      subtitle="Gestiona tus capacidades bilingües" 
      icon={Globe}
      onAdd={() => addItem('languages', { language: 'Nuevo Idioma', level: 'Intermedio', score: 40 })}
    >
      <div className="grid gap-4">
        {data.languages.map((lang, idx) => {
          const levelToScore: Record<string, number> = { 'Básico': 20, 'Intermedio': 40, 'Avanzado': 60, 'Experto': 80, 'Nativo': 100 };
          const scoreToLevel: Record<number, string> = { 20: 'Básico', 40: 'Intermedio', 60: 'Avanzado', 80: 'Experto', 100: 'Nativo' };
          const progress = (lang.score / 100) * 100;

          return (
            <div key={idx} className="group relative bg-gray-50/50 dark:bg-zinc-950/50 p-5 rounded-2xl border border-gray-100/80 dark:border-zinc-800/80 hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-500/5">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                <button onClick={() => onMoveItem('languages', idx, 'up')} className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-zinc-700" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('languages', idx, 'down')} className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-zinc-700" disabled={idx === data.languages.length - 1}><ChevronDown size={14}/></button>
                <button onClick={() => removeItem('languages', idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-zinc-700"><Trash2 size={14} /></button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] pl-0.5">Nombre del Idioma</label>
                    <input 
                      value={lang.language} 
                      onChange={(e) => updateItem('languages', idx, 'language', e.target.value)}
                      className="w-full bg-transparent font-black text-base text-gray-800 dark:text-white focus:outline-none placeholder:text-gray-300 dark:placeholder:text-zinc-700"
                      placeholder="Ejem: Inglés"
                    />
                  </div>
                  <div className="w-32 space-y-1.5 text-right relative">
                    <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] pr-0.5">Nivel</label>
                    <div className="relative">
                      <button 
                        onClick={() => setOpenLevelIdx(openLevelIdx === idx ? null : idx)}
                        className={`w-full bg-teal-500/5 dark:bg-teal-500/10 text-xs font-bold text-teal-600 dark:text-teal-400 border border-teal-500/20 py-1.5 px-3 rounded-lg focus:outline-none flex items-center justify-between hover:bg-teal-500 hover:text-white transition-all group/select ${openLevelIdx === idx ? 'ring-2 ring-teal-500/20 border-teal-500' : ''}`}
                      >
                        <span className="flex-1 text-center">{lang.level}</span>
                        <ChevronDown size={12} className={`transition-transform duration-300 ${openLevelIdx === idx ? 'rotate-180' : ''}`} />
                      </button>

                      {openLevelIdx === idx && (
                        <>
                          <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setOpenLevelIdx(null)}
                          />
                          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl shadow-teal-500/10 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            {['Básico', 'Intermedio', 'Avanzado', 'Experto', 'Nativo'].map(l => (
                              <button
                                key={l}
                                onClick={() => {
                                  const level = l;
                                  const list = [...data.languages];
                                  list[idx] = { ...lang, level, score: levelToScore[level] || lang.score };
                                  onChange({ ...data, languages: list });
                                  setOpenLevelIdx(null);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-teal-50 dark:hover:bg-teal-500/10 ${
                                  lang.level === l 
                                    ? 'text-teal-600 dark:text-teal-400 bg-teal-500/5' 
                                    : 'text-gray-600 dark:text-zinc-400'
                                }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-0.5">Dominio</span>
                    <span className="text-[10px] font-black text-teal-600 dark:text-teal-400">{progress}%</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const score = val * 20;
                      const isActive = (lang.score / 20) === val;
                      return (
                        <button
                          key={val}
                          onClick={() => {
                            const list = [...data.languages];
                            list[idx] = { ...lang, score, level: scoreToLevel[score] || lang.level };
                            onChange({ ...data, languages: list });
                          }}
                          className={`flex-1 group/btn relative h-10 rounded-xl border-2 transition-all overflow-hidden ${
                            isActive 
                              ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20' 
                              : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-400 hover:border-teal-500/30 hover:text-teal-500'
                          }`}
                        >
                          <span className="relative z-10 text-xs font-black">{val}</span>
                          {!isActive && <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </EditorFormSection>
  );
};
