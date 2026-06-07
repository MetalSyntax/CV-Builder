import React from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditableText } from '../common/EditableText';

interface ResumeHeaderProps {
  data: ResumeData;
  fontSizes: ResumeData['fontSizes'];
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  contactBarLayout?: 'flex' | 'grid' | 'grid-2x2';
  profileImage?: string;
  handleFocus: (el: HTMLElement, field: keyof ResumeData['fontSizes']) => void;
  onChange: (data: ResumeData) => void;
}

const getHref = (type: string, val: string) => {
  const clean = val.trim();
  if (!clean) return '';
  if (type === 'email') return `mailto:${clean}`;
  if (type === 'phone') return `tel:${clean.replace(/\s+/g, '')}`;
  if (type === 'website') {
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://${clean}`;
  }
  if (type === 'linkedin') {
    if (/^https?:\/\//i.test(clean)) return clean;
    if (clean.includes('linkedin.com')) return `https://${clean}`;
    return `https://linkedin.com/in/${clean}`;
  }
  if (type === 'github') {
    if (/^https?:\/\//i.test(clean)) return clean;
    if (clean.includes('github.com')) return `https://${clean}`;
    return `https://github.com/${clean}`;
  }
  return clean;
};

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  data,
  fontSizes,
  primaryColor,
  accentColor,
  contactBarColor,
  contactBarLayout = 'flex',
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
                style={{ fontSize: `${fontSizes.name}px`, lineHeight: data.lineHeights?.name ?? 1.2 }}
                className="font-black tracking-tighter mb-1 uppercase"
                value={data.name}
                onFocus={(el) => handleFocus(el, 'name')}
                onChange={(val) => onChange({ ...data, name: val })}
              />
            )}
            {data.title.trim() && (
              <EditableText
                tagName="p"
                style={{ fontSize: `${fontSizes.title}px`, color: accentColor, lineHeight: data.lineHeights?.title ?? 1.5 }}
                className="mb-3 font-normal opacity-100"
                value={data.title}
                onFocus={(el) => handleFocus(el, 'title')}
                onChange={(val) => onChange({ ...data, title: val })}
              />
            )}
            {data.summary.trim() && (
              <EditableText
                tagName="p"
                style={{ fontSize: `${fontSizes.summary}px`, lineHeight: data.lineHeights?.summary ?? 1.6 }}
                className="font-normal opacity-100 text-justify w-full"
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
        className={
          contactBarLayout === 'grid'
            ? "text-white py-2.5 px-10 grid grid-cols-3 gap-y-2 gap-x-6 justify-items-center print:no-links"
            : contactBarLayout === 'grid-2x2'
            ? "text-white py-2.5 px-10 grid grid-cols-2 gap-y-2 gap-x-6 justify-items-center print:no-links"
            : "text-white py-1.5 px-10 flex flex-wrap gap-y-1.5 gap-x-6 items-center justify-around print:no-links"
        }
      >
        {data.contact.email.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <a
              href={getHref('email', data.contact.email)}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-white min-w-0 break-all inline-flex items-center"
            >
              <EditableText
                value={data.contact.email}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, email: val } })}
                className="min-w-[50px]"
              />
            </a>
          </div>
        )}
        {data.contact.phone.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Phone size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <a
              href={getHref('phone', data.contact.phone)}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-white min-w-0 break-all inline-flex items-center"
            >
              <EditableText
                value={data.contact.phone}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, phone: val } })}
                className="min-w-[50px]"
              />
            </a>
          </div>
        )}
        {data.contact.location.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <EditableText
              value={data.contact.location}
              onFocus={(el) => handleFocus(el, 'contact')}
              onChange={(val) => onChange({ ...data, contact: { ...data.contact, location: val } })}
              className="min-w-[50px]"
            />
          </div>
        )}
        {data.contact.website && data.contact.website.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <LinkIcon size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <a
              href={getHref('website', data.contact.website)}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-white min-w-0 break-all inline-flex items-center"
            >
              <EditableText
                value={data.contact.website}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, website: val } })}
                className="min-w-[40px]"
              />
            </a>
          </div>
        )}
        {data.contact.linkedin && data.contact.linkedin.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Linkedin size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <a
              href={getHref('linkedin', data.contact.linkedin)}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-white min-w-0 break-all inline-flex items-center"
            >
              <EditableText
                value={data.contact.linkedin}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, linkedin: val } })}
                className="min-w-[40px]"
              />
            </a>
          </div>
        )}
        {data.contact.github && data.contact.github.trim() && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Github size={fontSizes.contact + 2} className="text-white opacity-90 flex-shrink-0" />
            <a
              href={getHref('github', data.contact.github)}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) e.preventDefault(); }}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-white min-w-0 break-all inline-flex items-center"
            >
              <EditableText
                value={data.contact.github}
                onFocus={(el) => handleFocus(el, 'contact')}
                onChange={(val) => onChange({ ...data, contact: { ...data.contact, github: val } })}
                className="min-w-[40px]"
              />
            </a>
          </div>
        )}
      </div>
    </>
  );
};
