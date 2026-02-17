import React from 'react';
import { ResumeData } from '../../types';

interface ResumeSectionHeaderProps {
  title: string;
  accentColor: string;
  sectionStyle: ResumeData['sectionStyle'];
  fontSize: number;
}

export const ResumeSectionHeader: React.FC<ResumeSectionHeaderProps> = ({
  title,
  accentColor,
  sectionStyle,
  fontSize,
}) => {
  return (
    <h2
      style={{ 
        fontSize: `${fontSize}px`, 
        color: accentColor,
        borderBottomColor: sectionStyle === 'modern' ? accentColor : undefined
      }}
      className={`font-bold uppercase tracking-[0.15em] mb-2 flex items-center justify-between ${
        sectionStyle === 'elegant' ? 'border-l-4 pl-3 border-gray-100' : 
        sectionStyle === 'modern' ? 'border-b-2' : 
        'border-b border-gray-200 opacity-80'
      }`}
    >
      <span>{title}</span>
      {sectionStyle === 'elegant' && <div className="h-px flex-1 bg-gray-100 ml-4 opacity-50"></div>}
    </h2>
  );
};
