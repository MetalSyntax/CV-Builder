import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface LanguagesSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;

  return (
    <section key="languages" className="section-container">
      <ResumeSectionHeader 
        title="IDIOMAS" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.languages.map((lang, index) => {
          if (!lang.language.trim()) return null;
          const dots = Math.round(lang.score / 20);
          return (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <EditableText
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold text-gray-800 leading-tight shrink-0"
                  value={lang.language}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.languages];
                    newList[index] = { ...lang, language: val };
                    onChange({ ...data, languages: newList });
                  }}
                />
                <div className="flex-1 border-b border-dotted border-gray-300 mb-1 opacity-50"></div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer hover:scale-125 transition-transform ${dot <= dots ? '' : 'bg-gray-200'}`}
                      style={dot <= dots ? { backgroundColor: accentColor } : {}}
                      onClick={() => {
                        const score = dot * 20;
                        const scoreToLevel: Record<number, string> = { 20: 'Básico', 40: 'Intermedio', 60: 'Avanzado', 80: 'Experto', 100: 'Nativo' };
                        const newList = [...data.languages];
                        newList[index] = { ...lang, score, level: scoreToLevel[score] || lang.level };
                        onChange({ ...data, languages: newList });
                      }}
                    />
                  ))}
                </div>
              </div>
              {lang.level.trim() && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content * 0.85}px` }}
                  className="text-gray-400 italic font-medium mt-0.5 leading-tight opacity-80"
                  value={lang.level}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const levelToScore: Record<string, number> = { 'Básico': 20, 'Intermedio': 40, 'Avanzado': 60, 'Experto': 80, 'Nativo': 100 };
                    const newList = [...data.languages];
                    newList[index] = { ...lang, level: val, score: levelToScore[val] || lang.score };
                    onChange({ ...data, languages: newList });
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
