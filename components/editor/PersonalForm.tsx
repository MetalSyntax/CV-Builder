import React from 'react';
import { User, Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';

interface PersonalFormProps {
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
  updateContact: (field: keyof ResumeData['contact'], value: string) => void;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({
  data,
  updateField,
  updateContact
}) => {
  return (
    <EditorFormSection title="Información Personal" subtitle="Tus datos básicos de contacto" icon={User}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Nombre Completo</label>
          <input 
            value={data.name} 
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs font-black text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            placeholder="Ejem: Juan Pérez"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Título Profesional</label>
          <input 
            value={data.title} 
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            placeholder="Ejem: Desarrollador Fullstack"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Perfil Profesional / Resumen</label>
          <textarea 
            value={data.summary} 
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs text-gray-700 dark:text-zinc-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all min-h-[100px] leading-relaxed"
            placeholder="Breve descripción de tus habilidades y objetivos..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
              <Mail size={10} /> Email
            </label>
            <input 
              value={data.contact.email} 
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
              <Phone size={10} /> Teléfono
            </label>
            <input 
              value={data.contact.phone} 
              onChange={(e) => updateContact('phone', e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
            <MapPin size={10} /> Ubicación
          </label>
          <input 
            value={data.contact.location} 
            onChange={(e) => updateContact('location', e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-2 px-4 text-xs text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            placeholder="Ciudad, País"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
              <LinkIcon size={10} /> Web
            </label>
            <input 
              value={data.contact.website} 
              onChange={(e) => updateContact('website', e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-[10px] text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
              <Linkedin size={10} /> LinkedIn
            </label>
            <input 
              value={data.contact.linkedin} 
              onChange={(e) => updateContact('linkedin', e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-[10px] text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
              <Github size={10} /> Github
            </label>
            <input 
              value={data.contact.github} 
              onChange={(e) => updateContact('github', e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-[10px] text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>
        </div>
      </div>
    </EditorFormSection>
  );
};
