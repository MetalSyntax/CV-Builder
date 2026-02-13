import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Bold, Italic, Minus, Plus, Type, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  textColor: string;
  fontSize: 'sm' | 'base' | 'lg';
  profileImage?: string; // Mantened para compatibilidad si es necesario, pero preferiremos data.profileImage
  onChange: (data: ResumeData) => void;
}

const EditableText: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onFocus?: (el: HTMLElement) => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: keyof HTMLElementTagNameMap;
  multiline?: boolean;
}> = ({ value, onChange, onFocus, className, style, tagName: Tag = 'div', multiline = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={onInput}
      onFocus={(e) => onFocus?.(e.currentTarget)}
      className={`${className} outline-none focus:bg-teal-50/20 focus:ring-1 focus:ring-teal-200/50 rounded px-1 -mx-1 transition-all`}
      style={style}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

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
  const { fontSizes } = data;
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

  const renderEducation = () => (
    <section key="education" className="section-container">
      <h2
        style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
        className="font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
      >
        EDUCACIÓN
      </h2>
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

  const renderExperience = () => (
    <section key="experience" className="section-container">
      <h2
        style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
        className="font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
      >
        EXPERIENCIA
      </h2>
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

  const renderSkills = () => {
    const hasVisibleSkills = data.skills.filter(s => s.trim()).length > 0;
    if (!hasVisibleSkills) return null;

    return (
      <section key="skills" className="section-container">
        <h2
          style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
          className="font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
        >
          HABILIDADES
        </h2>
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

  const renderCourses = () => (
    <section key="courses" className="section-container">
      <h2
        style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
        className="font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
      >
        CERTIFICACIONES
      </h2>
      <div className="space-y-3">
        {data.courses.map((course, index) => {
          const hasContent = course.title.trim() || (course.date && course.date.trim()) || (course.provider && course.provider.trim());
          if (!hasContent) return null;

          return (
            <div key={index}>
              <div className="flex gap-1 font-bold leading-tight text-gray-800" style={{ fontSize: `${fontSizes.content}px` }}>
                {course.title.trim() && (
                  <EditableText
                    value={course.title}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.courses];
                      newList[index] = { ...course, title: val };
                      onChange({ ...data, courses: newList });
                    }}
                  />
                )}
                {course.date && course.date.trim() !== '' && (
                  <>
                    <span className="ml-1 opacity-70">(</span>
                    <EditableText
                      value={course.date}
                      onFocus={(el) => handleFocus(el, 'content')}
                      onChange={(val) => {
                        const newList = [...data.courses];
                        newList[index] = { ...course, date: val };
                        onChange({ ...data, courses: newList });
                      }}
                    />
                    <span className="opacity-70">)</span>
                  </>
                )}
              </div>
              {course.provider && course.provider.trim() !== '' && (
                <div className="text-gray-400 italic font-medium opacity-80 flex gap-1" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
                  <span>Impartido por:</span>
                  <EditableText
                    value={course.provider}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...data.courses];
                      newList[index] = { ...course, provider: val };
                      onChange({ ...data, courses: newList });
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

  const renderLanguages = () => (
    <section key="languages" className="section-container">
      <h2
        style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
        className="font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
      >
        IDIOMAS
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.languages.map((lang, index) => {
          if (!lang.language.trim()) return null;
          const dots = Math.round(lang.score / 20);
          return (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <EditableText
                  style={{ fontSize: `${fontSizes.content}px` }}
                  className="font-bold text-gray-800 leading-tight shrink-0"
                  value={lang.language}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.languages];
                    newList[index] = { ...lang, language: val };
                    onChange({ ...data, languages: newList });
                  }}
                />
                <div className="flex-1 border-b border-dotted border-gray-300 mb-1 opacity-50"></div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer hover:scale-125 transition-transform ${dot <= dots ? '' : 'bg-gray-200'}`}
                      style={dot <= dots ? { backgroundColor: accentColor } : {}}
                      onClick={() => {
                        const newList = [...data.languages];
                        newList[index] = { ...lang, score: dot * 20 };
                        onChange({ ...data, languages: newList });
                      }}
                    />
                  ))}
                </div>
              </div>
              {lang.level.trim() && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content * 0.85}px` }}
                  className="text-gray-400 italic font-medium mt-0.5 leading-tight opacity-80"
                  value={lang.level}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...data.languages];
                    newList[index] = { ...lang, level: val };
                    onChange({ ...data, languages: newList });
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderInterests = () => {
    const hasVisibleInterests = data.interests.filter(i => i.trim()).length > 0;
    if (!hasVisibleInterests) return null;

    return (
      <section key="interests" className="section-container">
        <h2
          style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }}
          className="font-bold uppercase tracking-[0.15em] mb-3 border-b-2 border-gray-100"
        >
          INTERESES
        </h2>
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

  const sectionMap: Record<string, () => React.ReactNode> = {
    education: renderEducation,
    experience: renderExperience,
    skills: renderSkills,
    courses: renderCourses,
    languages: renderLanguages,
    interests: renderInterests
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
      className={`bg-white shadow-2xl mx-auto flex flex-col items-stretch overflow-hidden relative font-sans shrink-0 ${fontSize === 'sm' ? 'scale-90 origin-top' : fontSize === 'lg' ? 'scale-105 origin-top' : ''}`}
      style={{
        color: textColor,
        width: '816px',
        height: '1056px',
        minWidth: '816px',
        minHeight: '1056px'
      }}
    >
      {/* Dynamic Toolbar */}
      {toolbarState.show && (
        <div
          className="absolute z-50 flex items-center bg-zinc-900 text-white rounded-lg shadow-2xl p-1 border border-white/10"
          style={{ top: toolbarState.top, left: toolbarState.left }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Bold size={14} />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Italic size={14} />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => updateFontSize(-1)}
            className="p-2 hover:bg-white/10 rounded px-3 text-[10px]"
          >
            A-
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => updateFontSize(1)}
            className="p-2 hover:bg-white/10 rounded px-3 text-[10px]"
          >
            A+
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setToolbarState(prev => ({ ...prev, show: false }))}
            className="p-2 hover:bg-white/10 rounded ml-2"
          >
            <Type size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header
        style={{ backgroundColor: primaryColor }}
        className="text-white p-8 flex flex-col justify-end relative shadow-inner"
      >
        <div className="flex items-center justify-between gap-10">
          <div className="flex-1">
            {data.name.trim() && (
              <EditableText
                tagName="h1"
                style={{ fontSize: `${fontSizes.name}px` }}
                className="font-black tracking-tighter leading-none mb-1 uppercase"
                value={data.name}
                onFocus={(el) => handleFocus(el, 'name')}
                onChange={(val) => onChange({ ...data, name: val })}
              />
            )}
            {data.title.trim() && (
              <EditableText
                tagName="p"
                style={{ fontSize: `${fontSizes.title}px` }}
                className="opacity-90 mb-3 font-medium"
                value={data.title}
                onFocus={(el) => handleFocus(el, 'title')}
                onChange={(val) => onChange({ ...data, title: val })}
              />
            )}
            {data.summary.trim() && (
              <EditableText
                tagName="p"
                style={{ fontSize: `${fontSizes.summary}px` }}
                className="leading-tight opacity-95 text-justify w-full"
                value={data.summary}
                multiline
                onFocus={(el) => handleFocus(el, 'summary')}
                onChange={(val) => onChange({ ...data, summary: val })}
              />
            )}
          </div>

          {/* Profile Image */}
          {(profileImage || data.profileImage) && !data.hideProfileImage && (
            <div className="w-36 h-36 rounded-full border-[6px] border-white/20 overflow-hidden bg-gray-200 shrink-0 shadow-xl z-10">
              <img
                src={data.profileImage || profileImage}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* Contact Bar */}
      <div
        style={{ backgroundColor: contactBarColor, fontSize: `${fontSizes.contact}px` }}
        className="text-white py-1.5 px-10 flex gap-6 items-center justify-around print:no-links"
      >
        {data.contact.email.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Mail size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <EditableText
              value={data.contact.email}
              onFocus={(el) => handleFocus(el, 'contact')}
              onChange={(val) => onChange({ ...data, contact: { ...data.contact, email: val } })}
              className="min-w-[50px]"
            />
          </div>
        )}
        {data.contact.phone.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Phone size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <EditableText
              value={data.contact.phone}
              onFocus={(el) => handleFocus(el, 'contact')}
              onChange={(val) => onChange({ ...data, contact: { ...data.contact, phone: val } })}
              className="min-w-[50px]"
            />
          </div>
        )}
        {data.contact.location.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <EditableText
              value={data.contact.location}
              onFocus={(el) => handleFocus(el, 'contact')}
              onChange={(val) => onChange({ ...data, contact: { ...data.contact, location: val } })}
              className="min-w-[50px] max-w-[300px]"
            />
          </div>
        )}
        {data.contact.website && data.contact.website.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <LinkIcon size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <span className="truncate">
              <EditableText
                value={data.contact.website}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, website: val } })}
                className="min-w-[40px] max-w-[150px]"
              />
            </span>
          </div>
        )}
        {data.contact.linkedin && data.contact.linkedin.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Linkedin size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <span className="truncate">
              <EditableText
                value={data.contact.linkedin}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, linkedin: val } })}
                className="min-w-[40px] max-w-[150px]"
              />
            </span>
          </div>
        )}
        {data.contact.github && data.contact.github.trim() && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Github size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <span className="truncate">
              <EditableText
                value={data.contact.github}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, github: val } })}
                className="min-w-[40px] max-w-[150px]"
              />
            </span>
          </div>
        )}
      </div>

      {/* Main Content Two Columns */}
      <main className="grid grid-cols-2 gap-x-12 p-10 pt-6 flex-1">
        {/* Left Column */}
        <div className="space-y-6">
          {leftSections.map(sectionId => sectionMap[sectionId]())}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightSections.map(sectionId => sectionMap[sectionId]())}
        </div>
      </main>
    </div>
  );
};

export default Resume;
