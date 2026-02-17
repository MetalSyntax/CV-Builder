import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface EducationSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;

  return (
    <section key="education" className="section-container">
      <ResumeSectionHeader 
        title="EDUCACIÓN" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="space-y-3">
        {data.education.map((edu, index) => {
          const hasContent = edu.degree.trim() || edu.institution.trim() || edu.period.trim() || edu.location.trim();
          if (!hasContent) return null;

          return (
            <div key={index}>
              {edu.degree.trim() && (
                <EditableText
                  tagName="h3"
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold leading-tight text-gray-900"
                  value={edu.degree}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.education];
                    newList[index] = { ...edu, degree: val };
                    onChange({ ...data, education: newList });
                  }}
                />
              )}
              {edu.institution.trim() && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold text-gray-700 leading-tight opacity-90"
                  value={edu.institution}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.education];
                    newList[index] = { ...edu, institution: val };
                    onChange({ ...data, education: newList });
                  }}
                />
              )}
              <div className="flex justify-between text-gray-400 mt-0.5 opacity-80" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
                {edu.period.trim() && (
                  <EditableText
                    value={edu.period}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.education];
                      newList[index] = { ...edu, period: val };
                      onChange({ ...data, education: newList });
                    }}
                  />
                )}
                {edu.location.trim() && (
                  <EditableText
                    className="italic"
                    value={edu.location}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.education];
                      newList[index] = { ...edu, location: val };
                      onChange({ ...data, education: newList });
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
