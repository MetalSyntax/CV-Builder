import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { ResumeData } from '../types';
import { ResumeHeader } from './resume/ResumeHeader';
import { ExperienceSection } from './resume/ExperienceSection';
import { EducationSection } from './resume/EducationSection';
import { SkillsSection } from './resume/SkillsSection';
import { CoursesSection } from './resume/CoursesSection';
import { LanguagesSection } from './resume/LanguagesSection';
import { InterestsSection } from './resume/InterestsSection';
import { ProjectsSection } from './resume/ProjectsSection';
import { CustomSectionDisplay } from './resume/CustomSection';
import { ResumeToolbar } from './resume/ResumeToolbar';
import { ExecutiveTemplate } from './resume/templates/ExecutiveTemplate';
import { TimelineTemplate } from './resume/templates/TimelineTemplate';

const getPageDimensions = (format?: 'A4' | 'Letter') => {
  if (format === 'A4') return { width: 794, height: 1122 };
  return { width: 816, height: 1056 };
};

const getMarginPx = (margin?: 'compact' | 'normal' | 'wide') => {
  if (margin === 'compact') return 16;
  if (margin === 'wide') return 56;
  return 40;
};

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  textColor: string;
  fontSize: 'sm' | 'base' | 'lg';
  contactBarLayout?: 'flex' | 'grid' | 'grid-2x2';
  profileImage?: string;
  fontFamily?: string;
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
  profileImage,
  fontFamily,
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

  const { width: PAGE_W, height: PAGE_H } = getPageDimensions(data.pageFormat);
  const marginPx = getMarginPx(data.pageMargin);

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
      setNumPages(Math.max(1, Math.ceil((el.scrollHeight - 8) / PAGE_H)));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [PAGE_H]);

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

  // Build section map (includes custom sections dynamically)
  const customSectionMap: Record<string, React.FC<any>> = {};
  (data.customSections || []).forEach(section => {
    const sectionId = `custom-${section.id}`;
    customSectionMap[sectionId] = (props: any) => (
      <CustomSectionDisplay
        data={props.data}
        section={section}
        handleFocus={props.handleFocus}
        accentColor={props.accentColor}
        onChange={props.onChange}
      />
    );
  });

  const sectionMap: Record<string, React.FC<any>> = {
    education: EducationSection,
    experience: ExperienceSection,
    skills: SkillsSection,
    courses: CoursesSection,
    languages: LanguagesSection,
    interests: InterestsSection,
    projects: ProjectsSection,
    ...customSectionMap,
  };

  const hidden = data.hiddenSections || [];
  const knownSections = Object.keys(sectionMap);

  // Build layout, ensuring 'projects' appears in right column if not already placed
  const defaultLayout = {
    left: ['experience', 'education'],
    right: ['skills', 'courses', 'languages', 'interests', 'projects']
  };
  const layout = data.columnLayout || defaultLayout;

  // Add projects to right column if not present in either column
  const allInLayout = [...layout.left, ...layout.right];
  const hasProjects = (data.projects || []).some(p => !p.hidden);
  const extraRight = hasProjects && !allInLayout.includes('projects') ? ['projects'] : [];

  // Add custom sections not in layout
  const customIds = (data.customSections || []).map(s => `custom-${s.id}`);
  const extraCustom = customIds.filter(id => !allInLayout.includes(id));

  const leftSections = layout.left.filter(s => knownSections.includes(s) && !hidden.includes(s));
  const rightSections = [
    ...layout.right.filter(s => knownSections.includes(s) && !hidden.includes(s)),
    ...extraRight,
    ...extraCustom.filter(id => !hidden.includes(id)),
  ];

  const scaleClass = fontSize === 'sm' ? 'scale-90 origin-top' : fontSize === 'lg' ? 'scale-105 origin-top' : '';

  const templateProps = {
    data,
    fontSizes: data.fontSizes,
    primaryColor,
    accentColor,
    textColor,
    handleFocus,
    onChange,
    pageMarginPx: marginPx,
  };

  // Non-modern templates render without the page-frame paging system for simplicity
  // (they use the full content div approach)
  if (data.template === 'executive' || data.template === 'timeline') {
    const TemplateComp = data.template === 'executive' ? ExecutiveTemplate : TimelineTemplate;
    return (
      <div
        id="resume-wrapper"
        className={`flex flex-col items-start shrink-0 ${scaleClass}`}
        style={{ gap: '32px', fontFamily: fontFamily || 'Ubuntu, sans-serif' }}
      >
        <ResumeToolbar
          show={toolbarState.show}
          top={toolbarState.top}
          left={toolbarState.left}
          onExecCommand={execCommand}
          onUpdateFontSize={updateFontSize}
          currentFontSize={toolbarState.activeField ? data.fontSizes[toolbarState.activeField] : data.fontSizes.content}
          activeFormats={activeFormats}
        />
        {Array.from({ length: numPages }).map((_, pageIndex) => (
          <React.Fragment key={`page-${pageIndex}`}>
            {pageIndex > 0 && (
              <div className="flex items-center gap-3 print:hidden" style={{ width: `${PAGE_W}px` }}>
                <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-600" />
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Página {pageIndex + 1}</span>
                <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-600" />
              </div>
            )}
            <div
              className="resume-page-frame bg-white shadow-2xl"
              style={{ width: `${PAGE_W}px`, height: `${PAGE_H}px`, overflow: 'hidden', position: 'relative', color: textColor }}
            >
              <div
                ref={pageIndex === 0 ? firstPageInnerRef : undefined}
                style={{ position: 'absolute', top: `${-pageIndex * PAGE_H}px`, left: 0, width: `${PAGE_W}px` }}
              >
                <TemplateComp {...templateProps} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Modern template (default)
  const resumeBody = (
    <>
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
        className={`flex-1 ${data.columnStyle === 'single' ? 'flex flex-col gap-y-10' : 'grid gap-x-12'}`}
        style={{
          padding: `${marginPx}px`,
          paddingTop: `${Math.round(marginPx * 0.6)}px`,
          gridTemplateColumns:
            data.columnStyle === 'side-left' ? '240px 1fr' :
            data.columnStyle === 'side-right' ? '1fr 240px' :
            data.columnStyle === 'balanced' ? '1fr 1fr' : undefined
        }}
      >
        <div className="space-y-6">
          {(data.columnStyle === 'single'
            ? [...new Set([...leftSections, ...rightSections])]
            : leftSections
          ).map((sectionId, index) => {
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
    </>
  );

  return (
    <div
      id="resume-wrapper"
      className={`flex flex-col items-start shrink-0 ${scaleClass}`}
      style={{ gap: '32px', fontFamily: fontFamily || undefined }}
    >
      <ResumeToolbar
        show={toolbarState.show}
        top={toolbarState.top}
        left={toolbarState.left}
        onExecCommand={execCommand}
        onUpdateFontSize={updateFontSize}
        currentFontSize={toolbarState.activeField ? data.fontSizes[toolbarState.activeField] : data.fontSizes.content}
        activeFormats={activeFormats}
      />

      {Array.from({ length: numPages }).map((_, pageIndex) => (
        <React.Fragment key={`page-${pageIndex}`}>
          {pageIndex > 0 && (
            <div className="flex items-center gap-3 print:hidden" style={{ width: `${PAGE_W}px` }}>
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
              width: `${PAGE_W}px`,
              height: `${PAGE_H}px`,
              overflow: 'hidden',
              position: 'relative',
              color: textColor,
            }}
          >
            <div
              ref={pageIndex === 0 ? firstPageInnerRef : undefined}
              style={{
                position: 'absolute',
                top: `${-pageIndex * PAGE_H}px`,
                left: 0,
                width: `${PAGE_W}px`,
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
