import React from 'react';
import { ResumeData, ProjectItem } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';
import { Github, Link as LinkIcon } from 'lucide-react';

interface ProjectsSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;
  const projects = data.projects || [];
  const visibleProjects = projects.filter(p => !p.hidden && (p.title.trim() || p.description.trim()));
  if (visibleProjects.length === 0) return null;

  const sectionTitle = data.sectionNames?.['projects'] || (
    data.language === 'en' ? 'PROJECTS' : data.language === 'pt' ? 'PROJETOS' : 'PROYECTOS'
  );

  return (
    <section key="projects" className="section-container">
      <ResumeSectionHeader
        title={sectionTitle}
        accentColor={accentColor}
        sectionStyle={data.sectionStyle}
        fontSize={fontSizes.sectionHeaders}
      />
      <div className="space-y-3">
        {projects.map((proj, index) => {
          if (proj.hidden || (!proj.title.trim() && !proj.description.trim())) return null;
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                {proj.title.trim() && (
                  <EditableText
                    tagName="h3"
                    style={{ fontSize: `${fontSizes.content}px` }}
                    className="font-bold leading-tight"
                    value={proj.title}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => {
                      const newList = [...(data.projects || [])];
                      newList[index] = { ...proj, title: val };
                      onChange({ ...data, projects: newList });
                    }}
                  />
                )}
                <div className="flex gap-2 shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }} className="flex items-center gap-1 opacity-60 hover:opacity-100" style={{ color: accentColor }}>
                      <Github size={fontSizes.content - 2} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }} className="flex items-center gap-1 opacity-60 hover:opacity-100" style={{ color: accentColor }}>
                      <LinkIcon size={fontSizes.content - 2} />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
              {proj.description.trim() && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content * 0.95}px` }}
                  className="leading-relaxed opacity-80"
                  value={proj.description}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => {
                    const newList = [...(data.projects || [])];
                    newList[index] = { ...proj, description: val };
                    onChange({ ...data, projects: newList });
                  }}
                />
              )}
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.filter(t => t.trim()).map((tech, ti) => (
                    <span
                      key={ti}
                      style={{ fontSize: `${fontSizes.content * 0.75}px`, borderColor: accentColor, color: accentColor }}
                      className="border rounded px-1.5 py-0.5 font-bold opacity-70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
