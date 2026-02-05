import React from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface ContentEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onMoveItem: (field: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ data, onChange, onMoveItem }) => {
  
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

  const updateFontSize = (field: keyof ResumeData['fontSizes'], value: number) => {
    onChange({
      ...data,
      fontSizes: { ...data.fontSizes, [field]: value }
    });
  };

  const FontSizeControl = ({ label, value, field }: { label: string, value: number, field: keyof ResumeData['fontSizes'] }) => (
    <div className="flex items-center gap-2 mt-1">
      <label className="text-[10px] text-gray-400 uppercase font-bold whitespace-nowrap">{label}</label>
      <input 
        type="range" min="6" max="72" value={value} 
        onChange={(e) => updateFontSize(field, parseInt(e.target.value))}
        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <span className="text-[10px] font-mono text-gray-400 w-4">{value}px</span>
    </div>
  );

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
          <FontSizeControl label="Tamaño Nombre" value={data.fontSizes.name} field="name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Título Profesional</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm"
          />
          <FontSizeControl label="Tamaño Título" value={data.fontSizes.title} field="title" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Perfil / Resumen</label>
          <textarea 
            rows={4}
            value={data.summary} 
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm"
          />
          <FontSizeControl label="Tamaño Resumen" value={data.fontSizes.summary} field="summary" />
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
        <FontSizeControl label="Tamaño Barra Contacto" value={data.fontSizes.contact} field="contact" />
      </section>

      {/* Global Section Controls */}
      <section className="bg-blue-50 p-4 rounded-lg space-y-3">
        <h4 className="text-xs font-bold text-blue-800 uppercase">Ajustes de Texto Globales</h4>
        <FontSizeControl label="Encabezados (Educación, etc)" value={data.fontSizes.sectionHeaders} field="sectionHeaders" />
        <FontSizeControl label="Contenido General" value={data.fontSizes.content} field="content" />
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
              <div className="absolute top-2 right-2 flex gap-1 items-center">
                <button onClick={() => onMoveItem('experience', idx, 'up')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('experience', idx, 'down')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === data.experience.length - 1}><ChevronDown size={14}/></button>
                <button 
                  onClick={() => removeItem('experience', idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
             onClick={() => addItem('education', { degree: 'Nuevo Título', institution: 'Institución', period: '2024', location: '' })}
             className="text-blue-600 hover:bg-blue-50 p-1 rounded"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border relative">
              <div className="absolute top-2 right-2 flex gap-1 items-center">
                <button onClick={() => onMoveItem('education', idx, 'up')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('education', idx, 'down')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === data.education.length - 1}><ChevronDown size={14}/></button>
                <button 
                  onClick={() => removeItem('education', idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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

      {/* Courses */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
           <h3 className="font-bold text-gray-700">Cursos / Certificaciones</h3>
           <button 
             onClick={() => addItem('courses', { title: 'Nuevo Curso', date: '2024', provider: 'Institución' })}
             className="text-blue-600 hover:bg-blue-50 p-1 rounded"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="space-y-4">
          {data.courses.map((course, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border relative">
              <div className="absolute top-2 right-2 flex gap-1 items-center">
                <button onClick={() => onMoveItem('courses', idx, 'up')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('courses', idx, 'down')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === data.courses.length - 1}><ChevronDown size={14}/></button>
                <button 
                  onClick={() => removeItem('courses', idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input 
                value={course.title} 
                onChange={(e) => updateItem('courses', idx, 'title', e.target.value)}
                className="w-full bg-transparent font-bold text-sm mb-1 focus:bg-white focus:outline-none"
                placeholder="Título del curso"
              />
              <div className="flex gap-2">
                <input 
                  value={course.provider} 
                  onChange={(e) => updateItem('courses', idx, 'provider', e.target.value)}
                  className="w-2/3 bg-transparent text-xs text-gray-600 focus:bg-white focus:outline-none"
                  placeholder="Proveedor / Institución"
                />
                <input 
                  value={course.date} 
                  onChange={(e) => updateItem('courses', idx, 'date', e.target.value)}
                  className="w-1/3 bg-transparent text-xs text-gray-500 focus:bg-white focus:outline-none"
                  placeholder="Fecha"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
           <h3 className="font-bold text-gray-700">Idiomas</h3>
           <button 
             onClick={() => addItem('languages', { language: 'Nuevo Idioma', level: 'Intermedio', score: 50 })}
             className="text-blue-600 hover:bg-blue-50 p-1 rounded"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="space-y-4">
          {data.languages.map((lang, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border relative">
              <div className="absolute top-2 right-2 flex gap-1 items-center border-b pb-1 mb-2">
                <button onClick={() => onMoveItem('languages', idx, 'up')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('languages', idx, 'down')} className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === data.languages.length - 1}><ChevronDown size={14}/></button>
                <button 
                  onClick={() => removeItem('languages', idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <input 
                  value={lang.language} 
                  onChange={(e) => updateItem('languages', idx, 'language', e.target.value)}
                  className="w-full bg-transparent font-bold text-sm focus:bg-white focus:outline-none"
                  placeholder="Idioma"
                />
                <select 
                  value={lang.level} 
                  onChange={(e) => updateItem('languages', idx, 'level', e.target.value)}
                  className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:outline-none border-0 p-0"
                >
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Experto">Experto</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
              <div className="mt-2 space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Escala (1-5)</label>
                <div className="flex gap-1 justify-between">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateItem('languages', idx, 'score', val * 20)}
                      className={`flex-1 h-6 rounded text-[10px] font-bold transition ${
                        (lang.score / 20) === val 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-400'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
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
