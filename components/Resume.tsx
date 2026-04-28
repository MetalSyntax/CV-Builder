import React, { useState, useLayoutEffect, useRef } from 'react';
import { ResumeData } from '../types';
import { ResumeHeader } from './resume/ResumeHeader';
import { ExperienceSection } from './resume/ExperienceSection';
import { EducationSection } from './resume/EducationSection';
import { SkillsSection } from './resume/SkillsSection';
import { CoursesSection } from './resume/CoursesSection';
import { LanguagesSection } from './resume/LanguagesSection';
import { InterestsSection } from './resume/InterestsSection';
import { ResumeToolbar } from './resume/ResumeToolbar';

const PAGE_HEIGHT = 1056;

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

  const [numPages, setNumPages] = useState(1);
  const firstPageInnerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = firstPageInnerRef.current;
    if (!el) return;

    const measure = () => {
      // Subtract 1px to prevent browser sub-pixel rounding from triggering an extra empty page
      setNumPages(Math.max(1, Math.ceil((el.scrollHeight - 8) / PAGE_HEIGHT)));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleFocus = (el: HTMLElement, field: keyof ResumeData['fontSizes']) => {
    const rect = el.getBoundingClientRect();
    setToolbarState({
      show: true,
      top: rect.top - 48,
      left: rect.left + rect.width / 2 - 100,
      activeField: field
    });
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

  const resumeBody = (
    <>
      <ResumeHeader
        data={data}
        fontSizes={data.fontSizes}
        primaryColor={primaryColor}
        accentColor={accentColor}
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
    </>
  );

  const scaleClass = fontSize === 'sm' ? 'scale-90 origin-top' : fontSize === 'lg' ? 'scale-105 origin-top' : '';

  return (
    <div
      id="resume-wrapper"
      className={`flex flex-col items-start shrink-0 font-sans ${scaleClass}`}
      style={{ gap: '32px' }}
    >
      <ResumeToolbar
        show={toolbarState.show}
        top={toolbarState.top}
        left={toolbarState.left}
        onExecCommand={execCommand}
        onUpdateFontSize={updateFontSize}
      />

      {Array.from({ length: numPages }).map((_, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {pageIndex > 0 && (
            <div
              className="flex items-center gap-3 print:hidden"
              style={{ width: '816px' }}
            >
              <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-600" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                Página {pageIndex + 1}
              </span>
              <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-600" />
            </div>
          )}

          <div
            className="resume-page-frame bg-white shadow-2xl"
            style={{
              width: '816px',
              height: `${PAGE_HEIGHT}px`,
              overflow: 'hidden',
              position: 'relative',
              color: textColor,
            }}
          >
            <div
              ref={pageIndex === 0 ? firstPageInnerRef : undefined}
              style={{
                position: 'absolute',
                top: `${-pageIndex * PAGE_HEIGHT}px`,
                left: 0,
                width: '816px',
              }}
            >
              {resumeBody}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Resume;
