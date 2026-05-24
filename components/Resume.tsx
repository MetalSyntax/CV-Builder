import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
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
  contactBarLayout?: 'flex' | 'grid' | 'grid-2x2';
  fontFamily?: string;
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
  contactBarLayout = 'flex',
  fontFamily = 'Ubuntu',
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

  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, justifyFull: false
  });

  const [numPages, setNumPages] = useState(1);
  const firstPageInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFormats = () => {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        justifyFull: document.queryCommandState('justifyFull'),
      });
    };
    document.addEventListener('selectionchange', updateFormats);
    return () => document.removeEventListener('selectionchange', updateFormats);
  }, []);

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
      top: rect.top - 52,
      left: rect.left + rect.width / 2 - 140,
      activeField: field
    });
  };

  const execCommand = (cmd: string) => {
    if (cmd === 'justifyLeft' || cmd === 'justifyFull') {
      const focused = document.activeElement as HTMLElement | null;
      if (focused?.isContentEditable) {
        // For inline elements (e.g. <span> inside <li>), walk up to nearest block
        let target: HTMLElement = focused;
        const display = getComputedStyle(target).display;
        if (display === 'inline' || display === 'inline-block') {
          let el: HTMLElement | null = target.parentElement;
          while (el) {
            const d = getComputedStyle(el).display;
            if (d === 'block' || d === 'list-item' || d === 'table-cell') {
              target = el;
              break;
            }
            if (el.id === 'resume-wrapper') break;
            el = el.parentElement;
          }
        }
        target.style.textAlign = cmd === 'justifyFull' ? 'justify' : 'left';
        setActiveFormats(prev => ({ ...prev, justifyFull: cmd === 'justifyFull' }));
      }
      return;
    }
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

  const sectionMap: Record<string, React.FC<any>> = {
    education: EducationSection,
    experience: ExperienceSection,
    skills: SkillsSection,
    courses: CoursesSection,
    languages: LanguagesSection,
    interests: InterestsSection
  };

  const layout = data.columnLayout || {
    left: ['experience', 'education'],
    right: ['skills', 'courses', 'languages', 'interests']
  };

  const hidden = data.hiddenSections || [];
  const knownSections = Object.keys(sectionMap);
  const leftSections = layout.left.filter(s => knownSections.includes(s) && !hidden.includes(s));
  const rightSections = layout.right.filter(s => knownSections.includes(s) && !hidden.includes(s));

  const updateLineHeight = (delta: number) => {
    if (!toolbarState.activeField) return;
    const currentLines = data.lineHeights || {
      name: 1.2, title: 1.5, summary: 1.6, sectionHeaders: 1.4, content: 1.5, contact: 1.5
    };
    const current = currentLines[toolbarState.activeField] || 1.5;
    const newSize = Math.max(0.5, Math.min(3.0, current + delta));
    onChange({
      ...data,
      lineHeights: {
        ...currentLines,
        [toolbarState.activeField]: newSize
      }
    });
  };

  const resumeBody = (
    <div style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
      <ResumeHeader
        data={data}
        fontSizes={data.fontSizes}
        primaryColor={primaryColor}
        accentColor={accentColor}
        contactBarColor={contactBarColor}
        contactBarLayout={contactBarLayout}
        profileImage={profileImage}
        handleFocus={handleFocus}
        onChange={onChange}
      />
      <main
        className={`p-10 pt-6 flex-1 ${
          data.columnStyle === 'single' ? 'flex flex-col gap-y-10' : 'grid'
        }`}
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          gridTemplateColumns: data.columnStyle === 'side-left' ? '240px 1fr' :
                               data.columnStyle === 'side-right' ? '1fr 240px' :
                               data.columnStyle === 'balanced' ? '1fr 1fr' : undefined
        }}
      >
        <div className="space-y-6">
          {(data.columnStyle === 'single' ? [...new Set([...leftSections, ...rightSections])] : leftSections).map((sectionId, index) => {
            const Component = sectionMap[sectionId];
            if (!Component) return null;
            return (
              <Component
                key={`${sectionId}-left-${index}`}
                data={data}
                handleFocus={handleFocus}
                accentColor={accentColor}
                primaryColor={primaryColor}
                onChange={onChange}
              />
            );
          })}
        </div>
        {data.columnStyle !== 'single' && (
          <div className="space-y-6">
            {rightSections.map((sectionId, index) => {
              const Component = sectionMap[sectionId];
              if (!Component) return null;
              return (
                <Component
                  key={`${sectionId}-right-${index}`}
                  data={data}
                  handleFocus={handleFocus}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  onChange={onChange}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
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
        onUpdateLineHeight={updateLineHeight}
        currentFontSize={toolbarState.activeField ? data.fontSizes[toolbarState.activeField] : 12}
        currentLineHeight={toolbarState.activeField ? (data.lineHeights?.[toolbarState.activeField] ?? 1.5) : 1.5}
        activeFormats={activeFormats}
      />

      {Array.from({ length: numPages }).map((_, pageIndex) => (
        <React.Fragment key={`page-${pageIndex}`}>
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
