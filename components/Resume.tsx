import React, { useState } from 'react';
import { ResumeData } from '../types';
import { ResumeHeader } from './resume/ResumeHeader';
import { ExperienceSection } from './resume/ExperienceSection';
import { EducationSection } from './resume/EducationSection';
import { SkillsSection } from './resume/SkillsSection';
import { CoursesSection } from './resume/CoursesSection';
import { LanguagesSection } from './resume/LanguagesSection';
import { InterestsSection } from './resume/InterestsSection';
import { ResumeToolbar } from './resume/ResumeToolbar';

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  textColor: string;
  fontSize: 'sm' | 'base' | 'lg';
  profileImage?: string;
  onChange: (data: ResumeData) => void;
}

const Resume: React.FC<ResumeProps> = ({
  data,
  primaryColor,
  accentColor,
  contactBarColor,
  textColor,
  fontSize,
  profileImage,
  onChange
}) => {
  const [toolbarState, setToolbarState] = useState<{
    show: boolean;
    top: number;
    left: number;
    activeField?: keyof ResumeData['fontSizes'];
  }>({
    show: false,
    top: 0,
    left: 0
  });

  const handleFocus = (el: HTMLElement, field: keyof ResumeData['fontSizes']) => {
    const rect = el.getBoundingClientRect();
    const containerEl = document.getElementById('resume-content');
    const containerRect = containerEl?.getBoundingClientRect();

    if (containerRect) {
      const currentScale = fontSize === 'sm' ? 0.9 : fontSize === 'lg' ? 1.05 : 1;

      setToolbarState({
        show: true,
        top: (rect.top - containerRect.top) / currentScale - 45,
        left: (rect.left - containerRect.left + (rect.width / 2)) / currentScale - 100,
        activeField: field
      });
    }
  };

  const execCommand = (cmd: string) => {
    document.execCommand(cmd, false);
  };

  const updateFontSize = (delta: number) => {
    if (toolbarState.activeField) {
      const current = data.fontSizes[toolbarState.activeField];
      const next = Math.max(6, Math.min(72, current + delta));
      onChange({
        ...data,
        fontSizes: {
          ...data.fontSizes,
          [toolbarState.activeField]: next
        }
      });
    }
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    education: () => <EducationSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />,
    experience: () => <ExperienceSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />,
    skills: () => <SkillsSection data={data} handleFocus={handleFocus} accentColor={accentColor} primaryColor={primaryColor} onChange={onChange} />,
    courses: () => <CoursesSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />,
    languages: () => <LanguagesSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />,
    interests: () => <InterestsSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />
  };

  const layout = data.columnLayout || {
    left: ['experience', 'education'],
    right: ['skills', 'courses', 'languages', 'interests']
  };

  const hidden = data.hiddenSections || [];
  const leftSections = layout.left.filter(s => !hidden.includes(s));
  const rightSections = layout.right.filter(s => !hidden.includes(s));

  return (
    <div
      id="resume-content"
      className={`bg-white shadow-2xl mx-auto flex flex-col items-stretch relative font-sans shrink-0 pb-10 ${fontSize === 'sm' ? 'scale-90 origin-top' : fontSize === 'lg' ? 'scale-105 origin-top' : ''}`}
      style={{
        color: textColor,
        width: '816px',
        minHeight: '1056px',
        backgroundImage: `linear-gradient(to bottom, transparent 1055px, #f3f4f6 1055px, #f3f4f6 1056px, transparent 1056px)`,
        backgroundSize: '100% 1056px',
        backgroundRepeat: 'repeat-y'
      }}
    >
      <div className="absolute inset-0 pointer-events-none print:hidden opacity-30 px-4" style={{ top: '1056px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute w-full flex items-center gap-2" style={{ top: `${i * 1056}px` }}>
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white px-2">Hoja {i + 2}</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
        ))}
      </div>
      <ResumeToolbar 
        show={toolbarState.show}
        top={toolbarState.top}
        left={toolbarState.left}
        onExecCommand={execCommand}
        onUpdateFontSize={updateFontSize}
      />

      <ResumeHeader 
        data={data}
        fontSizes={data.fontSizes}
        primaryColor={primaryColor}
        contactBarColor={contactBarColor}
        profileImage={profileImage}
        handleFocus={handleFocus}
        onChange={onChange}
      />

      <main 
        className={`p-10 pt-6 flex-1 ${
          data.columnStyle === 'single' ? 'flex flex-col gap-y-10' : 'grid gap-x-12'
        }`}
        style={{
          gridTemplateColumns: data.columnStyle === 'side-left' ? '240px 1fr' : 
                               data.columnStyle === 'side-right' ? '1fr 240px' : 
                               data.columnStyle === 'balanced' ? '1fr 1fr' : undefined
        }}
      >
        <div className="space-y-6">
          {(data.columnStyle === 'single' ? [...leftSections, ...rightSections] : leftSections).map(sectionId => sectionMap[sectionId]?.())}
        </div>

        {data.columnStyle !== 'single' && (
          <div className="space-y-6">
            {rightSections.map(sectionId => sectionMap[sectionId]?.())}
          </div>
        )}
      </main>
    </div>
  );
};

export default Resume;
