import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface SkillsSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  primaryColor: string;
  onChange: (data: ResumeData) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  primaryColor,
  onChange,
}) => {
  const { fontSizes } = data;
  const hasVisibleSkills = data.skills.filter(s => s.trim()).length > 0;
  if (!hasVisibleSkills) return null;

  return (
    <section key="skills" className="section-container">
      <ResumeSectionHeader 
        title="HABILIDADES" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="flex flex-wrap gap-2 mr-4">
        {data.skills.map((skill, index) => {
          if (!skill.trim()) return null;
          return (
            <EditableText
              tagName="span"
              key={index}
              style={{
                backgroundColor: primaryColor,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
                fontSize: `${fontSizes.content * 0.8}px`
              }}
              className="text-white px-2.5 py-0.5 rounded-[4px] font-bold opacity-100 shadow-none border-0 mr-1"
              value={skill}
              onFocus={(el) => handleFocus(el, 'content')}
              onChange={(val) => {
                const newList = [...data.skills];
                newList[index] = val;
                onChange({ ...data, skills: newList });
              }}
            />
          );
        })}
      </div>
    </section>
  );
};
