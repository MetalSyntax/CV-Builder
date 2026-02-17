import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface InterestsSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;
  const hasVisibleInterests = data.interests.filter(i => i.trim()).length > 0;
  if (!hasVisibleInterests) return null;

  return (
    <section key="interests" className="section-container">
      <ResumeSectionHeader 
        title="INTERESES" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
      <div className="flex flex-wrap gap-2">
        {data.interests.map((interest, i) => {
          if (!interest.trim()) return null;
          return (
            <EditableText
              key={i}
              style={{
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
                fontSize: `${fontSizes.content * 0.8}px`
              }}
              className="bg-white border border-gray-400 rounded-[5px] px-3 py-1 font-bold text-gray-900 shadow-none whitespace-nowrap opacity-100 mr-1"
              value={interest}
              onFocus={(el) => handleFocus(el, 'content')}
              onChange={(val) => {
                const newList = [...data.interests];
                newList[i] = val;
                onChange({ ...data, interests: newList });
              }}
            />
          );
        })}
      </div>
    </section>
  );
};
