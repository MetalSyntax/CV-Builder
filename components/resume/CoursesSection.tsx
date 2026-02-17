import React from 'react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface CoursesSectionProps {
  data: ResumeData;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  data,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;

  return (
    <section key="courses" className="section-container">
      <ResumeSectionHeader 
        title="CERTIFICACIONES" 
        accentColor={accentColor} 
        sectionStyle={data.sectionStyle} 
        fontSize={fontSizes.sectionHeaders} 
      />
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
};
