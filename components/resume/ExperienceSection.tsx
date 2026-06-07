import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface ExperienceSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;

  return (
    <section key="experience" className="section-container">
      <ResumeSectionHeader 
        title={data.language === 'en' ? 'EXPERIENCE' : data.language === 'pt' ? 'EXPERIÊNCIA' : 'EXPERIENCIA'} 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="space-y-3">
        {data.experience.map((exp, index) => {
          if (exp.hidden) return null;
          const hasContent = exp.role.trim() || exp.company.trim() || exp.period.trim() || exp.location.trim() || exp.tasks.some(t => t.trim()) || (exp.companyDescription && exp.companyDescription.trim()) || (exp.companyContact && exp.companyContact.trim());
          if (!hasContent) return null;

          return (
            <div key={index} className="space-y-1">
              {exp.role.trim() && (
                <EditableText
                  tagName="h3"
                  style={{ fontSize: `${fontSizes.content}px`, lineHeight: data.lineHeights?.content ?? 1.5 }}
                  className="font-normal"
                  value={exp.role}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.experience];
                    newList[index] = { ...exp, role: val };
                    onChange({ ...data, experience: newList });
                  }}
                />
              )}
              {exp.company.trim() && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content}px`, lineHeight: data.lineHeights?.content ?? 1.5 }}
                  className="font-bold opacity-90"
                  value={exp.company}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.experience];
                    newList[index] = { ...exp, company: val };
                    onChange({ ...data, experience: newList });
                  }}
                />
              )}
              <div className="flex justify-between mt-0.5 opacity-60" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
                {exp.period.trim() && (
                  <EditableText
                    value={exp.period}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.experience];
                      newList[index] = { ...exp, period: val };
                      onChange({ ...data, experience: newList });
                    }}
                  />
                )}
                {exp.location.trim() && (
                  <EditableText
                    className="italic"
                    value={exp.location}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.experience];
                      newList[index] = { ...exp, location: val };
                      onChange({ ...data, experience: newList });
                    }}
                  />
                )}
              </div>

              {exp.companyDescription && exp.companyDescription.trim() && (
                <div className="mt-1 italic opacity-70" style={{ fontSize: `${fontSizes.content * 0.95}px`, lineHeight: data.lineHeights?.content ?? 1.5 }}>
                  <EditableText
                    value={exp.companyDescription}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.experience];
                      newList[index] = { ...exp, companyDescription: val };
                      onChange({ ...data, experience: newList });
                    }}
                  />
                </div>
              )}

              {exp.tasks.some(t => t.trim()) && (
                <div className="mt-1.5">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>
                    {data.language === 'en' ? 'Achievements / Tasks' : data.language === 'pt' ? 'Conquistas / Tarefas' : 'Logros / Tareas'}
                  </div>
                  <ul 
                    className="space-y-0.5 list-disc list-inside experience-tasks" 
                    style={{ 
                      lineHeight: data.taskLineHeight ?? 1.25,
                      '--accent-color': accentColor 
                    } as React.CSSProperties}
                  >
                    {exp.tasks.map((task, i) => {
                      if (!task.trim()) return null;
                      return (
                        <li key={i} className="pl-1 leading-tight">
                          <EditableText
                            tagName="span"
                            style={{ fontSize: `${fontSizes.content}px`, lineHeight: data.lineHeights?.content ?? 1.5 }}
                            className="relative -left-1"
                            value={task}
                            onFocus={(el) => handleFocus(el, 'content')}
                            onChange={(val) => {
                              const newTasks = [...exp.tasks];
                              newTasks[i] = val;
                              const newList = [...data.experience];
                              newList[index] = { ...exp, tasks: newTasks };
                              onChange({ ...data, experience: newList });
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {exp.companyContact && exp.companyContact.trim() && (
                <div className="mt-1.5 flex items-center gap-1.5" style={{ fontSize: `${fontSizes.content * 0.95}px` }}>
                  <span className="font-bold shrink-0" style={{ color: accentColor }}>
                    {data.language === 'en' ? 'Contact:' : data.language === 'pt' ? 'Contato:' : 'Contacto:'}
                  </span>
                  <EditableText
                    value={exp.companyContact}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.experience];
                      newList[index] = { ...exp, companyContact: val };
                      onChange({ ...data, experience: newList });
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
