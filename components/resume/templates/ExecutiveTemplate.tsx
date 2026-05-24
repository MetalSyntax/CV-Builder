import React from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../../../types';
import { EditableText } from '../../common/EditableText';
import { SkillsSection } from '../SkillsSection';
import { CoursesSection } from '../CoursesSection';
import { LanguagesSection } from '../LanguagesSection';
import { InterestsSection } from '../InterestsSection';

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

const getHref = (type: string, val: string) => {
  const clean = val.trim();
  if (!clean) return '';
  if (type === 'email') return `mailto:${clean}`;
  if (type === 'phone') return `tel:${clean.replace(/\s+/g, '')}`;
  return clean.startsWith('http') ? clean : `https://${clean}`;
};

export const ExecutiveTemplate: React.FC<TemplateProps> = ({
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

  const SectionDivider = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mb-3 mt-1">
      <span
        style={{ fontSize: `${fontSizes.sectionHeaders * 0.85}px`, color: primaryColor }}
        className="font-black uppercase tracking-[0.2em] whitespace-nowrap"
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: primaryColor, opacity: 0.25 }} />
    </div>
  );

  const sectionNames = data.sectionNames || {};

  // Collect all sections in order
  const allSections = [
    ...(data.columnLayout?.left || ['experience', 'education']),
    ...(data.columnLayout?.right || ['skills', 'courses', 'languages', 'interests']),
  ].filter((s, i, arr) => arr.indexOf(s) === i && !data.hiddenSections?.includes(s));

  return (
    <div style={{ padding, color: textColor }}>
      {/* Header */}
      <div className="mb-6">
        {data.name.trim() && (
          <EditableText
            tagName="h1"
            style={{ fontSize: `${fontSizes.name}px`, color: primaryColor, lineHeight: data.lineHeights?.name ?? 1.2 }}
            className="font-black tracking-tighter uppercase mb-1"
            value={data.name}
            onFocus={(el) => handleFocus(el, 'name')}
            onChange={(val) => onChange({ ...data, name: val })}
          />
        )}
        <div className="h-0.5 w-full mb-2" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
        {data.title.trim() && (
          <EditableText
            tagName="p"
            style={{ fontSize: `${fontSizes.title}px`, color: accentColor, lineHeight: 1.4 }}
            className="font-normal mb-3"
            value={data.title}
            onFocus={(el) => handleFocus(el, 'title')}
            onChange={(val) => onChange({ ...data, title: val })}
          />
        )}
        {/* Contact bar */}
        <div className="flex flex-wrap gap-x-5 gap-y-1" style={{ fontSize: `${fontSizes.contact}px` }}>
          {data.contact.email.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Mail size={fontSizes.contact + 1} />
              <EditableText value={data.contact.email} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, email: val } })} />
            </div>
          )}
          {data.contact.phone.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Phone size={fontSizes.contact + 1} />
              <EditableText value={data.contact.phone} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, phone: val } })} />
            </div>
          )}
          {data.contact.location.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <MapPin size={fontSizes.contact + 1} />
              <EditableText value={data.contact.location} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, location: val } })} />
            </div>
          )}
          {data.contact.linkedin?.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Linkedin size={fontSizes.contact + 1} />
              <EditableText value={data.contact.linkedin} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, linkedin: val } })} />
            </div>
          )}
          {data.contact.github?.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Github size={fontSizes.contact + 1} />
              <EditableText value={data.contact.github} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, github: val } })} />
            </div>
          )}
          {data.contact.website?.trim() && (
            <div className="flex items-center gap-1.5 opacity-70">
              <LinkIcon size={fontSizes.contact + 1} />
              <EditableText value={data.contact.website} onFocus={(el) => handleFocus(el, 'contact')} onChange={(val) => onChange({ ...data, contact: { ...data.contact, website: val } })} />
            </div>
          )}
        </div>
        {data.summary.trim() && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <EditableText
              tagName="p"
              style={{ fontSize: `${fontSizes.summary}px`, lineHeight: data.lineHeights?.summary ?? 1.6 }}
              className="opacity-80 leading-relaxed"
              value={data.summary}
              multiline
              onFocus={(el) => handleFocus(el, 'summary')}
              onChange={(val) => onChange({ ...data, summary: val })}
            />
          </div>
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
                <SectionDivider title={title} />
                <div className="space-y-4">
                  {data.experience.map((exp, i) => {
                    if (exp.hidden || (!exp.role.trim() && !exp.company.trim())) return null;
                    return (
                      <div key={i} className={exp.avoidBreak ? 'break-inside-avoid' : ''}>
                        <div className="flex justify-between items-baseline gap-2 mb-0.5">
                          <EditableText tagName="h3" style={{ fontSize: `${fontSizes.content}px`, color: primaryColor }} className="font-black uppercase tracking-wide" value={exp.role} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.experience]; l[i] = { ...exp, role: val }; onChange({ ...data, experience: l }); }} />
                          <span className="opacity-50 text-right shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{exp.period}</span>
                        </div>
                        <div className="flex justify-between items-baseline gap-2 mb-1.5">
                          <EditableText style={{ fontSize: `${fontSizes.content * 0.95}px` }} className="opacity-70 font-medium" value={exp.company} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.experience]; l[i] = { ...exp, company: val }; onChange({ ...data, experience: l }); }} />
                          <span className="opacity-50 shrink-0 italic" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{exp.location}</span>
                        </div>
                        {exp.companyDescription?.trim() && (
                          <p className="italic opacity-60 mb-1.5" style={{ fontSize: `${fontSizes.content * 0.9}px` }}>{exp.companyDescription}</p>
                        )}
                        {exp.tasks.some(t => t.trim()) && (
                          <ul className="space-y-0.5 list-disc list-inside" style={{ lineHeight: data.taskLineHeight ?? 1.25 }}>
                            {exp.tasks.map((task, ti) => task.trim() ? (
                              <li key={ti} className="pl-1" style={{ fontSize: `${fontSizes.content}px` }}>
                                <EditableText tagName="span" className="relative -left-1" style={{ fontSize: `${fontSizes.content}px`, lineHeight: data.taskLineHeight ?? 1.25 }} value={task} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const newT = [...exp.tasks]; newT[ti] = val; const l = [...data.experience]; l[i] = { ...exp, tasks: newT }; onChange({ ...data, experience: l }); }} />
                              </li>
                            ) : null)}
                          </ul>
                        )}
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
                <SectionDivider title={title} />
                <div className="space-y-3">
                  {data.education.map((edu, i) => {
                    if (edu.hidden || !edu.degree.trim()) return null;
                    return (
                      <div key={i} className={edu.avoidBreak ? 'break-inside-avoid' : ''}>
                        <div className="flex justify-between items-baseline gap-2">
                          <EditableText tagName="h3" style={{ fontSize: `${fontSizes.content}px`, color: primaryColor }} className="font-black uppercase tracking-wide" value={edu.degree} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.education]; l[i] = { ...edu, degree: val }; onChange({ ...data, education: l }); }} />
                          <span className="opacity-50 shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{edu.period}</span>
                        </div>
                        <div className="flex justify-between items-baseline gap-2">
                          <EditableText style={{ fontSize: `${fontSizes.content * 0.95}px` }} className="opacity-70" value={edu.institution} onFocus={(el) => handleFocus(el, 'content')} onChange={(val) => { const l = [...data.education]; l[i] = { ...edu, institution: val }; onChange({ ...data, education: l }); }} />
                          <span className="opacity-50 italic shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>{edu.location}</span>
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
                <SectionDivider title={title} />
                <SkillsSection data={data} handleFocus={handleFocus} accentColor={accentColor} primaryColor={primaryColor} onChange={onChange} />
              </div>
            );
          }

          if (sectionId === 'languages') {
            const langs = data.languages.filter(l => l.language.trim() && !l.hidden);
            if (langs.length === 0) return null;
            const title = sectionNames['languages'] || (data.language === 'en' ? 'LANGUAGES' : data.language === 'pt' ? 'IDIOMAS' : 'IDIOMAS');
            return (
              <div key="languages">
                <SectionDivider title={title} />
                <LanguagesSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />
              </div>
            );
          }

          if (sectionId === 'courses') {
            const courses = data.courses.filter(c => !c.hidden && c.title.trim());
            if (courses.length === 0) return null;
            const title = sectionNames['courses'] || (data.language === 'en' ? 'CERTIFICATIONS' : data.language === 'pt' ? 'CERTIFICAÇÕES' : 'CURSOS');
            return (
              <div key="courses">
                <SectionDivider title={title} />
                <CoursesSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />
              </div>
            );
          }

          if (sectionId === 'interests') {
            const interests = data.interests.filter((v, i) => v.trim() && !data.hiddenInterests?.includes(i));
            if (interests.length === 0) return null;
            const title = sectionNames['interests'] || (data.language === 'en' ? 'INTERESTS' : data.language === 'pt' ? 'INTERESSES' : 'INTERESES');
            return (
              <div key="interests">
                <SectionDivider title={title} />
                <InterestsSection data={data} handleFocus={handleFocus} accentColor={accentColor} onChange={onChange} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
