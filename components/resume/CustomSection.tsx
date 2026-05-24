import React from 'react';
import { ResumeData, CustomSection as CustomSectionType } from '../../types';
import { EditableText } from '../common/EditableText';
import { ResumeSectionHeader } from './ResumeSectionHeader';

interface CustomSectionProps {
  data: ResumeData;
  section: CustomSectionType;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  accentColor: string;
  onChange: (data: ResumeData) => void;
}

export const CustomSectionDisplay: React.FC<CustomSectionProps> = ({
  data,
  section,
  handleFocus,
  accentColor,
  onChange,
}) => {
  const { fontSizes } = data;
  const visibleItems = section.items.filter(item => !item.hidden && (item.title?.trim() || item.description?.trim()));
  if (section.hidden || visibleItems.length === 0) return null;

  const updateItem = (itemIdx: number, field: string, val: string) => {
    const newSections = (data.customSections || []).map(s => {
      if (s.id !== section.id) return s;
      const newItems = s.items.map((item, i) => i === itemIdx ? { ...item, [field]: val } : item);
      return { ...s, items: newItems };
    });
    onChange({ ...data, customSections: newSections });
  };

  return (
    <section className="section-container">
      <ResumeSectionHeader
        title={section.title.toUpperCase()}
        accentColor={accentColor}
        sectionStyle={data.sectionStyle}
        fontSize={fontSizes.sectionHeaders}
      />
      <div className="space-y-2">
        {section.items.map((item, i) => {
          if (item.hidden || (!item.title?.trim() && !item.description?.trim())) return null;
          return (
            <div key={i} className="space-y-0.5">
              {item.title && (
                <div className="flex justify-between items-baseline gap-2">
                  <EditableText
                    tagName="h3"
                    style={{ fontSize: `${fontSizes.content}px` }}
                    className="font-bold leading-tight"
                    value={item.title}
                    onFocus={(el) => handleFocus(el, 'content')}
                    onChange={(val) => updateItem(i, 'title', val)}
                  />
                  {item.date && (
                    <span className="opacity-60 shrink-0" style={{ fontSize: `${fontSizes.content * 0.85}px` }}>
                      {item.date}
                    </span>
                  )}
                </div>
              )}
              {item.location && (
                <span className="opacity-60 italic" style={{ fontSize: `${fontSizes.content * 0.9}px` }}>
                  {item.location}
                </span>
              )}
              {item.description && (
                <EditableText
                  style={{ fontSize: `${fontSizes.content * 0.95}px` }}
                  className="leading-relaxed opacity-80"
                  value={item.description}
                  onFocus={(el) => handleFocus(el, 'content')}
                  onChange={(val) => updateItem(i, 'description', val)}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
