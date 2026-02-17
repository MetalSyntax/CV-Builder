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
        title="EXPERIENCIA" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="space-y-3">
        {data.experience.map((exp, index) => {
          const hasContent = exp.role.trim() || exp.company.trim() || exp.period.trim() || exp.location.trim() || exp.tasks.some(t => t.trim());
          if (!hasContent) return null;

          return (
            <div key={index}>
              {exp.role.trim() && (
                <EditableText
                  tagName="h3"
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold leading-tight text-gray-900"
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
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold text-gray-700 leading-tight opacity-90"
                  value={exp.company}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.experience];
                    newList[index] = { ...exp, company: val };
                    onChange({ ...data, experience: newList });
                  }}
                />
              )}
              <div className="flex justify-between text-gray-400 mt-0.5 opacity-80" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
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
              {exp.tasks.some(t => t.trim()) && (
                <ul className="mt-0.5 space-y-0 text-gray-600 list-disc list-inside leading-tight">
                  {exp.tasks.map((task, i) => {
                    if (!task.trim()) return null;
                    return (
                      <li key={i} className="pl-1 leading-tight">
                        <EditableText
                          tagName="span"
                          style={{ fontSize: `${fontSizes.content}px` }}
                          className="relative -left-1 leading-tight"
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
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
