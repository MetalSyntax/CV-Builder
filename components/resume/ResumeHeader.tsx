import React from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';

interface ResumeHeaderProps {
  data: ResumeData;
  fontSizes: ResumeData['fontSizes'];
  primaryColor: string;
  contactBarColor: string;
  profileImage?: string;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  onChange: (data: ResumeData) => void;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  data,
  fontSizes,
  primaryColor,
  contactBarColor,
  profileImage,
  handleFocus,
  onChange,
}) => {
  return (
    <>
      <header className="p-10 pb-6 text-white" style={{ backgroundColor: primaryColor }}>
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
    </>
  );
};
