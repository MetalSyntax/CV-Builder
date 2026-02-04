import React from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ContentEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ data, onChange }) => {
  
  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field: keyof typeof data.contact, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  // Generic Array Updaters
  const addItem = <T,>(field: keyof ResumeData, initialItem: T) => {
    const list = data[field] as T[];
    onChange({ ...data, [field]: [initialItem, ...list] });
  };

  const removeItem = (field: keyof ResumeData, index: number) => {
    const list = data[field] as any[];
    const newList = [...list];
    newList.splice(index, 1);
    onChange({ ...data, [field]: newList });
  };

  const updateItem = (field: keyof ResumeData, index: number, itemField: string, value: any) => {
    const list = data[field] as any[];
    const newList = [...list];
    newList[index] = { ...newList[index], [itemField]: value };
    onChange({ ...data, [field]: newList });
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Personal Info */}
      <section className="space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">Información Personal</h3>
        <div>
          <label className="block text-xs font-medium text-gray-500">Nombre Completo</label>
          <input 
            type="text" 
            value={data.name} 
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Título Profesional</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Perfil / Resumen</label>
          <textarea 
            rows={4}
            value={data.summary} 
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm"
          />
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">Contacto</h3>
        <div className="grid grid-cols-1 gap-3">
          <input 
            placeholder="Email"
            value={data.contact.email} 
            onChange={(e) => updateContact('email', e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
          <input 
            placeholder="Teléfono"
            value={data.contact.phone} 
            onChange={(e) => updateContact('phone', e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
          <input 
            placeholder="Ubicación"
            value={data.contact.location} 
            onChange={(e) => updateContact('location', e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
           <h3 className="font-bold text-gray-700">Experiencia</h3>
           <button 
             onClick={() => addItem<ExperienceItem>('experience', { role: 'Nuevo Cargo', company: 'Empresa', period: '2024', location: '', tasks: ['Nueva tarea'] })}
             className="text-blue-600 hover:bg-blue-50 p-1 rounded"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border relative group">
              <button 
                onClick={() => removeItem('experience', idx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
              <input 
                value={exp.role} 
                onChange={(e) => updateItem('experience', idx, 'role', e.target.value)}
                className="w-full bg-transparent font-bold text-sm mb-1 focus:bg-white focus:outline-none"
                placeholder="Cargo"
              />
              <input 
                value={exp.company} 
                onChange={(e) => updateItem('experience', idx, 'company', e.target.value)}
                className="w-full bg-transparent text-xs text-gray-600 mb-1 focus:bg-white focus:outline-none"
                placeholder="Empresa"
              />
              <div className="flex gap-2 mb-2">
                <input 
                  value={exp.period} 
                  onChange={(e) => updateItem('experience', idx, 'period', e.target.value)}
                  className="w-1/2 bg-transparent text-xs text-gray-500 focus:bg-white focus:outline-none"
                  placeholder="Periodo"
                />
                <input 
                  value={exp.location} 
                  onChange={(e) => updateItem('experience', idx, 'location', e.target.value)}
                  className="w-1/2 bg-transparent text-xs text-gray-500 focus:bg-white focus:outline-none"
                  placeholder="Ubicación"
                />
              </div>
              <textarea 
                value={exp.tasks.join('\n')} 
                onChange={(e) => updateItem('experience', idx, 'tasks', e.target.value.split('\n'))}
                className="w-full text-xs p-2 border rounded"
                rows={3}
                placeholder="Tareas (una por línea)"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
           <h3 className="font-bold text-gray-700">Educación</h3>
           <button 
             onClick={() => addItem<EducationItem>('education', { degree: 'Nuevo Título', institution: 'Institución', period: '2024', location: '' })}
             className="text-blue-600 hover:bg-blue-50 p-1 rounded"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border relative">
              <button 
                onClick={() => removeItem('education', idx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
              <input 
                value={edu.degree} 
                onChange={(e) => updateItem('education', idx, 'degree', e.target.value)}
                className="w-full bg-transparent font-bold text-sm mb-1 focus:bg-white focus:outline-none"
                placeholder="Título"
              />
              <input 
                value={edu.institution} 
                onChange={(e) => updateItem('education', idx, 'institution', e.target.value)}
                className="w-full bg-transparent text-xs text-gray-600 mb-1 focus:bg-white focus:outline-none"
                placeholder="Institución"
              />
              <input 
                value={edu.period} 
                onChange={(e) => updateItem('education', idx, 'period', e.target.value)}
                className="w-full bg-transparent text-xs text-gray-500 focus:bg-white focus:outline-none"
                placeholder="Periodo"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">Habilidades</h3>
        <textarea 
          value={data.skills.join(', ')} 
          onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded text-sm"
          rows={3}
          placeholder="Separadas por comas"
        />
      </section>

      {/* Interests */}
      <section className="space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">Intereses</h3>
        <textarea 
          value={data.interests.join('\n')} 
          onChange={(e) => updateField('interests', e.target.value.split('\n'))}
          className="w-full p-2 border rounded text-sm"
          rows={3}
          placeholder="Uno por línea"
        />
      </section>

    </div>
  );
};

export default ContentEditor;
