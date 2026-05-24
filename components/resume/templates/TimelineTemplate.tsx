import React from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../../../types';
import { EditableText } from '../../common/EditableText';

interface TemplateProps {
  data: ResumeData;
  fontSizes: ResumeData['fontSizes'];
  primaryColor: string;
  accentColor: string;
  textColor: string;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  onChange: (data: ResumeData) => void;
  pageMarginPx: number;
}

export const TimelineTemplate: React.FC<TemplateProps> = ({
  data,
  fontSizes,
  primaryColor,
  accentColor,
  textColor,
  handleFocus,
  onChange,
  pageMarginPx,
}) => {
  const padding = `${pageMarginPx}px`;
  const sectionNames = data.sectionNames || {};

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 style={{ fontSize: `${fontSizes.sectionHeaders}px`, color: accentColor }} className="font-black uppercase tracking-[0.15em] mb-3 mt-1">
      {title}
    </h2>
  );

  const allSections = [
    ...(data.columnLayout?.left || ['experience', 'education']),
    ...(data.columnLayout?.right || ['skills', 'courses', 'languages', 'interests']),
  ].filter((s, i, arr) => arr.indexOf(s) === i && !data.hiddenSections?.includes(s));

  return (
    <div style={{ padding, color: textColor }}>
      {/* Compact header */}
      <div className="mb-5 pb-4 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex items-start justify-between gap-6">
          <div>
            {data.name.trim() && (
              <EditableText tagName="h1" style={{ fontSize: `${fontSizes.name}px`, color: primaryColor, lineHeight: data.lineHeights?.name ?? 1.2 }} className="font-black tracking-tight uppercase mb-0.5" value={data.name} onFocus={(el) => handleFocus(el, 'name')} onChange={(val) => onChange({ ...data, name: val })} />
            )}
            {data.title.trim() && (
              <EditableText tagName="p" style={{ fontSize: `${fontSizes.title}px`, color: accentColor, lineHeight: 1.3 }} className="font-normal" value={data.title} onFocus={(el) => handleFocus(el, 'title')} onChange={(val) => onChange({ ...data, title: val })} />
            )}
          </div>
          <div className="flex flex-col gap-1 text-right shrink-0" style={{ fontSize: `${fontSizes.contact}px` }}>
            {data.contact.email.trim() && (
              <div className="flex items-center gap-1.5 justify-end opacity-70">
                <EditableText value={data.contact.email} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, email: val } })} />
                <Mail size={fontSizes.contact} />
              </div>
            )}
            {data.contact.phone.trim() && (
              <div className="flex items-center gap-1.5 justify-end opacity-70">
                <EditableText value={data.contact.phone} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, phone: val } })} />
                <Phone size={fontSizes.contact} />
              </div>
            )}
            {data.contact.location.trim() && (
              <div className="flex items-center gap-1.5 justify-end opacity-70">
                <EditableText value={data.contact.location} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, location: val } })} />
                <MapPin size={fontSizes.contact} />
              </div>
            )}
            {data.contact.linkedin?.trim() && (
              <div className="flex items-center gap-1.5 justify-end opacity-70">
                <EditableText value={data.contact.linkedin} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, linkedin: val } })} />
                <Linkedin size={fontSizes.contact} />
              </div>
            )}
            {data.contact.github?.trim() && (
              <div className="flex items-center gap-1.5 justify-end opacity-70">
                <EditableText value={data.contact.github} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, github: val } })} />
                <Github size={fontSizes.contact} />
              </div>
            )}
          </div>
        </div>
        {data.summary.trim() && (
          <EditableText tagName="p" style={{ fontSize: `${fontSizes.summary}px`, lineHeight: data.lineHeights?.summary ?? 1.6 }} className="mt-3 opacity-70 leading-relaxed" value={data.summary} multiline onFocus={(el) => handleFocus(el, 'summary')} onChange={(val) => onChange({ ...data, summary: val })} />
        )}
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {allSections.map((sectionId) => {
          if (sectionId === 'experience') {
            const visibleExp = data.experience.filter(e => !e.hidden && (e.role.trim() || e.company.trim()));
            if (visibleExp.length === 0) return null;
            const title = sectionNames['experience'] || (data.language === 'en' ? 'EXPERIENCE' : data.language === 'pt' ? 'EXPERIÊNCIA' : 'EXPERIENCIA');
            return (
              <div key="experience">
                <SectionHeader title={title} />
                <div className="space-y-0">
                  {data.experience.map((exp, i) => {
                    if (exp.hidden || (!exp.role.trim() && !exp.company.trim())) return null;
                    const isLast = i === data.experience.filter(e => !e.hidden).length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        {/* Timeline column */}
                        <div className="flex flex-col items-center" style={{ width: '16px', flexShrink: 0 }}>
                          <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                          {!isLast && <div className="flex-1 w-px mt-1" style={{ backgroundColor: accentColor, opacity: 0.3, minHeight: '32px' }} />}
                        </div>
                        {/* Content column */}
                        <div className={`flex-1 pb-4 ${exp.avoidBreak ? 'break-inside-avoid' : ''}`}>
                          <div className="flex justify-between items-baseline gap-2">
                            <EditableText tagName="h3" style={{ fontSize: `${fontSizes.content}px` }} className="font-bold leading-tight" value={exp.role} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.experience]; l[i] = { ...exp, role: val }; onChange({ ...data, experience: l }); }} />
                            <span className="opacity-50 shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{exp.period}</span>
                          </div>
                          <div className="opacity-60" style={{ fontSize: `${fontSizes.content * 0.9}px` }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                          {exp.tasks.some(t => t.trim()) && (
                            <ul className="mt-1 space-y-0.5 list-disc list-inside" style={{ lineHeight: data.taskLineHeight ?? 1.25 }}>
                              {exp.tasks.map((task, ti) => task.trim() ? (
                                <li key={ti} className="pl-1" style={{ fontSize: `${fontSizes.content}px` }}>
                                  <EditableText tagName="span" className="relative -left-1" style={{ fontSize: `${fontSizes.content}px`, lineHeight: data.taskLineHeight ?? 1.25 }} value={task} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const newT = [...exp.tasks]; newT[ti] = val; const l = [...data.experience]; l[i] = { ...exp, tasks: newT }; onChange({ ...data, experience: l }); }} />
                                </li>
                              ) : null)}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (sectionId === 'education') {
            const visibleEdu = data.education.filter(e => !e.hidden && e.degree.trim());
            if (visibleEdu.length === 0) return null;
            const title = sectionNames['education'] || (data.language === 'en' ? 'EDUCATION' : data.language === 'pt' ? 'FORMAÇÃO' : 'EDUCACIÓN');
            return (
              <div key="education">
                <SectionHeader title={title} />
                <div className="space-y-0">
                  {data.education.map((edu, i) => {
                    if (edu.hidden || !edu.degree.trim()) return null;
                    const isLast = i === data.education.filter(e => !e.hidden).length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center" style={{ width: '16px', flexShrink: 0 }}>
                          <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                          {!isLast && <div className="flex-1 w-px mt-1" style={{ backgroundColor: accentColor, opacity: 0.3, minHeight: '24px' }} />}
                        </div>
                        <div className={`flex-1 pb-4 ${edu.avoidBreak ? 'break-inside-avoid' : ''}`}>
                          <div className="flex justify-between items-baseline gap-2">
                            <EditableText tagName="h3" style={{ fontSize: `${fontSizes.content}px` }} className="font-bold leading-tight" value={edu.degree} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.education]; l[i] = { ...edu, degree: val }; onChange({ ...data, education: l }); }} />
                            <span className="opacity-50 shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{edu.period}</span>
                          </div>
                          <div className="opacity-60" style={{ fontSize: `${fontSizes.content * 0.9}px` }}>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (sectionId === 'skills') {
            const skills = data.skills.filter((s, i) => s.trim() && !data.hiddenSkills?.includes(i));
            if (skills.length === 0) return null;
            const title = sectionNames['skills'] || (data.language === 'en' ? 'SKILLS' : data.language === 'pt' ? 'HABILIDADES' : 'HABILIDADES');
            return (
              <div key="skills">
                <SectionHeader title={title} />
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: `${fontSizes.content * 0.9}px` }} className="opacity-80">
                      {i > 0 && <span className="mr-4" style={{ color: accentColor }}>·</span>}{skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'languages') {
            const langs = data.languages.filter(l => l.language.trim() && !l.hidden);
            if (langs.length === 0) return null;
            const title = sectionNames['languages'] || (data.language === 'en' ? 'LANGUAGES' : data.language === 'pt' ? 'IDIOMAS' : 'IDIOMAS');
            return (
              <div key="languages">
                <SectionHeader title={title} />
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {langs.map((lang, i) => (
                    <span key={i} style={{ fontSize: `${fontSizes.content * 0.9}px` }} className="opacity-80">
                      <span className="font-bold">{lang.language}</span> — {lang.level}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'courses') {
            const courses = data.courses.filter(c => !c.hidden && c.title.trim());
            if (courses.length === 0) return null;
            const title = sectionNames['courses'] || (data.language === 'en' ? 'CERTIFICATIONS' : data.language === 'pt' ? 'CERTIFICAÇÕES' : 'CURSOS');
            return (
              <div key="courses">
                <SectionHeader title={title} />
                <div className="space-y-1.5">
                  {courses.map((c, i) => (
                    <div key={i} className="flex justify-between items-baseline gap-2">
                      <span style={{ fontSize: `${fontSizes.content * 0.95}px` }} className="font-medium">{c.title}</span>
                      <span style={{ fontSize: `${fontSizes.content * 0.85}px` }} className="opacity-50 shrink-0">{c.provider} {c.date && `· ${c.date}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionId === 'interests') {
            const interests = data.interests.filter((v, i) => v.trim() && !data.hiddenInterests?.includes(i));
            if (interests.length === 0) return null;
            const title = sectionNames['interests'] || (data.language === 'en' ? 'INTERESTS' : data.language === 'pt' ? 'INTERESSES' : 'INTERESES');
            return (
              <div key="interests">
                <SectionHeader title={title} />
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {interests.map((interest, i) => (
                    <span key={i} style={{ fontSize: `${fontSizes.content * 0.9}px`, borderColor: accentColor }} className="border rounded px-2 py-0.5 opacity-70">{interest}</span>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
