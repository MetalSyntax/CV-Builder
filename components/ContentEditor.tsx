import React from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types';
import { 
  Plus, Minus, Trash2, ChevronUp, ChevronDown, 
  User, Briefcase, GraduationCap, Award, 
  Globe, Zap, Heart, Layout, Type, Palette, Link as LinkIcon,
  Eye, EyeOff, GripVertical, Linkedin, Github
} from 'lucide-react';

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
    <div className="flex items-center justify-between gap-3 mt-1.5 p-1 bg-white dark:bg-zinc-900/30 rounded-md border border-gray-100 dark:border-zinc-800/50 shadow-sm">
      <label className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-black pl-2 tracking-tighter">{label}</label>
      <div className="flex items-center gap-0.5 pr-1">
        <button 
          onClick={() => updateFontSize(field, Math.max(6, value - 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-400 hover:text-teal-500 transition-colors"
        >
          <Minus size={12} />
        </button>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) updateFontSize(field, Math.min(72, Math.max(6, val)));
          }}
          className="w-6 text-center bg-transparent text-[10px] font-bold text-teal-600 dark:text-teal-400 outline-none"
        />
        <button 
          onClick={() => updateFontSize(field, Math.min(72, value + 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-400 hover:text-teal-500 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );

  const toggleSectionVisibility = (section: string) => {
    const hidden = data.hiddenSections || [];
    const isHidden = hidden.includes(section);
    const newHidden = isHidden 
      ? hidden.filter(s => s !== section)
      : [...hidden, section];
    updateField('hiddenSections', newHidden);
  };


  const [dragged, setDragged] = React.useState<{idx: number, col: 'left' | 'right'} | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number, col: 'left' | 'right') => {
    setDragged({ idx: index, col });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number, col: 'left' | 'right') => {
    e.preventDefault();
    if (!dragged) return;
    
    const layout = { ... (data.columnLayout || { left: ['experience', 'education'], right: ['skills', 'courses', 'languages', 'interests'] }) };
    const sourceCol = layout[dragged.col];
    const targetCol = layout[col];
    
    if (dragged.col === col) {
      if (dragged.idx === index) return;
      const newCol = [...sourceCol];
      const [item] = newCol.splice(dragged.idx, 1);
      newCol.splice(index, 0, item);
      layout[col] = newCol;
    } else {
      const newSource = [...sourceCol];
      const newTarget = [...targetCol];
      const [item] = newSource.splice(dragged.idx, 1);
      newTarget.splice(index, 0, item);
      layout[dragged.col] = newSource;
      layout[col] = newTarget;
    }
    
    updateField('columnLayout', layout);
    setDragged({ idx: index, col });
  };

  const moveSection = (col: 'left' | 'right', index: number, direction: 'up' | 'down') => {
    const layout = { ... (data.columnLayout || { left: ['experience', 'education'], right: ['skills', 'courses', 'languages', 'interests'] }) };
    const column = [...layout[col]];
    if (direction === 'up' && index > 0) {
      [column[index], column[index - 1]] = [column[index - 1], column[index]];
    } else if (direction === 'down' && index < column.length - 1) {
      [column[index], column[index + 1]] = [column[index + 1], column[index]];
    }
    layout[col] = column;
    updateField('columnLayout', layout);
  };

  const SECTION_LABELS: Record<string, { label: string, icon: any }> = {
    experience: { label: 'Experiencia', icon: Briefcase },
    education: { label: 'Educación', icon: GraduationCap },
    skills: { label: 'Habilidades', icon: Zap },
    courses: { label: 'Certificados', icon: Award },
    languages: { label: 'Idiomas', icon: Globe },
    interests: { label: 'Intereses', icon: Heart }
  };

  const renderManagerItem = (section: string, idx: number, col: 'left' | 'right') => {
    const config = SECTION_LABELS[section];
    if (!config) return null;
    const isHidden = data.hiddenSections?.includes(section);
    const Icon = config.icon;
    const isDragging = dragged?.idx === idx && dragged?.col === col;

    return (
      <div 
        key={section} 
        draggable={!isHidden}
        onDragStart={(e) => handleDragStart(e, idx, col)}
        onDragOver={(e) => handleDragOver(e, idx, col)}
        onDragEnd={() => setDragged(null)}
        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-move group/item ${
          isDragging ? 'opacity-20 scale-95 border-teal-500 bg-teal-50/50' :
          isHidden 
            ? 'opacity-50 grayscale bg-gray-100/50 dark:bg-zinc-950/20 border-dashed border-gray-200 dark:border-zinc-800' 
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:border-teal-500/30'
        }`}
      >
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-300 group-hover/item:text-teal-500 transition-colors" />
          <div className={`p-1.5 rounded-lg ${isHidden ? 'bg-gray-200 dark:bg-zinc-800' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
            <Icon size={12} />
          </div>
          <span className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 truncate max-w-[80px]">{config.label}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => toggleSectionVisibility(section)}
            className={`p-1 rounded-lg transition-colors ${isHidden ? 'text-gray-400 hover:text-teal-500' : 'text-teal-600 hover:bg-teal-50'}`}
          >
            {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <button 
            onClick={() => moveSection(col, idx, 'up')}
            disabled={idx === 0}
            className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-10"
          >
            <ChevronUp size={12} />
          </button>
          <button 
            onClick={() => moveSection(col, idx, 'down')}
            disabled={idx === ((data.columnLayout?.[col] || []).length - 1)}
            className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-10"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Section Manager */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900/40 dark:to-zinc-900/20 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-800 dark:text-zinc-200">
          <Layout size={18} className="text-teal-500" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Gestor de Columnas</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column Manager */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Columna Izquierda</h4>
            <div 
              className="min-h-[50px] space-y-2"
              onDragOver={(e) => {
                e.preventDefault();
                if (dragged && dragged.col === 'right' && (data.columnLayout?.left?.length === 0)) {
                   handleDragOver(e, 0, 'left');
                }
              }}
            >
              {(data.columnLayout?.left || ['experience', 'education']).map((s, i) => renderManagerItem(s, i, 'left'))}
            </div>
          </div>

          {/* Right Column Manager */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Columna Derecha</h4>
            <div 
              className="min-h-[50px] space-y-2"
              onDragOver={(e) => {
                e.preventDefault();
                if (dragged && dragged.col === 'left' && (data.columnLayout?.right?.length === 0)) {
                  handleDragOver(e, 0, 'right');
                }
              }}
            >
              {(data.columnLayout?.right || ['skills', 'courses', 'languages', 'interests']).map((s, i) => renderManagerItem(s, i, 'right'))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <User size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Perfil Personal</h3>
          </div>
          <button 
            onClick={() => updateField('hideProfileImage', !data.hideProfileImage)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              data.hideProfileImage 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                : 'bg-teal-500/10 text-teal-600 hover:bg-teal-500/20'
            }`}
          >
            {data.hideProfileImage ? <EyeOff size={14} /> : <Eye size={14} />}
            {data.hideProfileImage ? 'Foto Oculta' : 'Foto Visible'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1 mb-1.5">Nombre Completo</label>
            <input 
              type="text" 
              value={data.name} 
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
              placeholder="Ej: Juan Pérez"
            />
            <FontSizeControl label="Tamaño Nombre" value={data.fontSizes.name} field="name" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1 mb-1.5">Título Profesional</label>
            <input 
              type="text" 
              value={data.title} 
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
              placeholder="Ej: Senior Software Engineer"
            />
            <FontSizeControl label="Tamaño Título" value={data.fontSizes.title} field="title" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1 mb-1.5">Resumen Ejecutivo</label>
            <textarea 
              rows={4}
              value={data.summary} 
              onChange={(e) => updateField('summary', e.target.value)}
              className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner resize-none"
              placeholder="Escribe un breve resumen de tu impacto profesional..."
            />
            <FontSizeControl label="Tamaño Resumen" value={data.fontSizes.summary} field="summary" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <Globe size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wider">Contacto</h3>
        </div>
        <div className="space-y-3">
          <input 
            placeholder="Email corporativo"
            value={data.contact.email} 
            onChange={(e) => updateContact('email', e.target.value)}
            className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
          />
          <input 
            placeholder="Teléfono móvil"
            value={data.contact.phone} 
            onChange={(e) => updateContact('phone', e.target.value)}
            className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
          />
          <input 
            placeholder="Ubicación (Ciudad, País)"
            value={data.contact.location} 
            onChange={(e) => updateContact('location', e.target.value)}
            className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
          />
          <input 
            placeholder="LinkedIn (URL o usuario)"
            value={data.contact.linkedin || ''} 
            onChange={(e) => updateContact('linkedin', e.target.value)}
            className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
          />
          <input 
            placeholder="GitHub (URL o usuario)"
            value={data.contact.github || ''} 
            onChange={(e) => updateContact('github', e.target.value)}
            className="w-full p-3 border rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-inner"
          />
        </div>
        <FontSizeControl label="Tamaño Barra Contacto" value={data.fontSizes.contact} field="contact" />
      </section>

      {/* Global Scaling */}
      <section className="bg-gradient-to-br from-teal-500/10 to-transparent dark:from-teal-500/5 p-5 rounded-2xl space-y-4 border border-teal-500/20 dark:border-teal-500/10 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <Zap size={18} />
          <h4 className="text-xs font-black uppercase tracking-[0.1em]">Escalado Global</h4>
        </div>
        <div className="space-y-3">
          <FontSizeControl label="Encabezados" value={data.fontSizes.sectionHeaders} field="sectionHeaders" />
          <FontSizeControl label="Contenido" value={data.fontSizes.content} field="content" />
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
             <Briefcase size={18} />
             <h3 className="font-bold text-sm uppercase tracking-wider">Experiencia</h3>
           </div>
           <button 
             onClick={() => addItem<ExperienceItem>('experience', { role: 'Nuevo Cargo', company: 'Empresa', period: '2024', location: '', tasks: ['Nueva tarea'] })}
             className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-2 rounded-xl transition-all active:scale-95"
           >
             <Plus size={18} />
           </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all hover:border-teal-500/30">
              <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <button onClick={() => onMoveItem('experience', idx, 'up')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('experience', idx, 'down')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === data.experience.length - 1}><ChevronDown size={14}/></button>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('experience', idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-3">
                <input 
                  value={exp.role} 
                  onChange={(e) => updateItem('experience', idx, 'role', e.target.value)}
                  className="w-full bg-transparent font-black text-sm text-gray-800 dark:text-white focus:outline-none"
                  placeholder="Cargo o Posición"
                />
                <input 
                  value={exp.company} 
                  onChange={(e) => updateItem('experience', idx, 'company', e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-teal-600 dark:text-teal-400 focus:outline-none"
                  placeholder="Empresa"
                />
                <div className="flex gap-2">
                  <input 
                    value={exp.period} 
                    onChange={(e) => updateItem('experience', idx, 'period', e.target.value)}
                    className="w-1/2 bg-transparent text-[10px] font-medium text-gray-500 dark:text-zinc-500 focus:outline-none"
                    placeholder="Periodo"
                  />
                  <input 
                    value={exp.location} 
                    onChange={(e) => updateItem('experience', idx, 'location', e.target.value)}
                    className="w-1/2 bg-transparent text-[10px] font-medium text-gray-500 dark:text-zinc-500 focus:outline-none"
                    placeholder="Ubicación"
                  />
                </div>
                <textarea 
                  value={exp.tasks.join('\n')} 
                  onChange={(e) => updateItem('experience', idx, 'tasks', e.target.value.split('\n'))}
                  className="w-full text-xs p-3 rounded-xl border-0 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 outline-none focus:ring-1 focus:ring-teal-500/30 transition-all resize-none shadow-sm"
                  rows={3}
                  placeholder="Tareas principales..."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
             <GraduationCap size={18} />
             <h3 className="font-bold text-sm uppercase tracking-wider">Educación</h3>
           </div>
           <button 
             onClick={() => addItem<EducationItem>('education', { degree: 'Nuevo Título', institution: 'Institución', period: '2024', location: '' })}
             className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-2 rounded-xl transition-all active:scale-95"
           >
             <Plus size={18} />
           </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all hover:border-teal-500/30">
              <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <button onClick={() => onMoveItem('education', idx, 'up')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('education', idx, 'down')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === data.education.length - 1}><ChevronDown size={14}/></button>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('education', idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-2">
                <input 
                  value={edu.degree} 
                  onChange={(e) => updateItem('education', idx, 'degree', e.target.value)}
                  className="w-full bg-transparent font-black text-sm text-gray-800 dark:text-white focus:outline-none"
                  placeholder="Título"
                />
                <input 
                  value={edu.institution} 
                  onChange={(e) => updateItem('education', idx, 'institution', e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-teal-600 dark:text-teal-400 focus:outline-none"
                  placeholder="Institución"
                />
                <input 
                  value={edu.period} 
                  onChange={(e) => updateItem('education', idx, 'period', e.target.value)}
                  className="w-full bg-transparent text-[10px] font-medium text-gray-500 dark:text-zinc-500 focus:outline-none"
                  placeholder="Periodo"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
             <Award size={18} />
             <h3 className="font-bold text-sm uppercase tracking-wider">Certificados</h3>
           </div>
           <button 
             onClick={() => addItem('courses', { title: 'Nuevo Curso', date: '2024', provider: 'Institución' })}
             className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-2 rounded-xl transition-all active:scale-95"
           >
             <Plus size={18} />
           </button>
        </div>
        <div className="space-y-4">
          {data.courses.map((course, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all hover:border-teal-500/30">
              <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <button onClick={() => onMoveItem('courses', idx, 'up')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('courses', idx, 'down')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === data.courses.length - 1}><ChevronDown size={14}/></button>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('courses', idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-2">
                <input 
                  value={course.title} 
                  onChange={(e) => updateItem('courses', idx, 'title', e.target.value)}
                  className="w-full bg-transparent font-black text-sm text-gray-800 dark:text-white focus:outline-none"
                  placeholder="Certificación"
                />
                <div className="flex gap-2">
                  <input 
                    value={course.provider} 
                    onChange={(e) => updateItem('courses', idx, 'provider', e.target.value)}
                    className="w-2/3 bg-transparent text-[10px] font-bold text-teal-600 dark:text-teal-400 focus:outline-none"
                    placeholder="Proveedor"
                  />
                  <input 
                    value={course.date} 
                    onChange={(e) => updateItem('courses', idx, 'date', e.target.value)}
                    className="w-1/3 bg-transparent text-[10px] font-medium text-gray-500 dark:text-zinc-500 focus:outline-none text-right"
                    placeholder="Año"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
             <Globe size={18} />
             <h3 className="font-bold text-sm uppercase tracking-wider">Idiomas</h3>
           </div>
           <button 
             onClick={() => addItem('languages', { language: 'Nuevo Idioma', level: 'Intermedio', score: 50 })}
             className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-2 rounded-xl transition-all active:scale-95"
           >
             <Plus size={18} />
           </button>
        </div>
        <div className="space-y-4">
          {data.languages.map((lang, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 relative group transition-all hover:border-teal-500/30">
              <div className="absolute top-3 right-3 flex gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm z-10">
                <button onClick={() => onMoveItem('languages', idx, 'up')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === 0}><ChevronUp size={14}/></button>
                <button onClick={() => onMoveItem('languages', idx, 'down')} className="p-1 text-gray-400 hover:text-teal-500 disabled:opacity-30" disabled={idx === data.languages.length - 1}><ChevronDown size={14}/></button>
                <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => removeItem('languages', idx)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Idioma</label>
                  <input 
                    value={lang.language} 
                    onChange={(e) => updateItem('languages', idx, 'language', e.target.value)}
                    className="w-full bg-transparent font-black text-sm text-gray-800 dark:text-white focus:outline-none"
                    placeholder="Idioma"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pr-1">Nivel</label>
                  <select 
                    value={lang.level} 
                    onChange={(e) => updateItem('languages', idx, 'level', e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-teal-600 dark:text-teal-400 focus:outline-none border-0 p-0 text-right appearance-none"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Experto">Experto</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex gap-1 justify-between bg-white dark:bg-zinc-900 p-1 rounded-xl">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateItem('languages', idx, 'score', val * 20)}
                      className={`flex-1 h-8 rounded-lg text-[10px] font-black transition-all ${
                        (lang.score / 20) === val 
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                          : 'text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-zinc-800'
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
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <Zap size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wider">Habilidades</h3>
        </div>
        <textarea 
          value={data.skills.join(', ')} 
          onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-4 border rounded-2xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none shadow-inner"
          rows={3}
          placeholder="Habilidades separadas por comas"
        />
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">Usa comas para separar cada elemento</p>
      </section>

      {/* Interests */}
      <section className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <Heart size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wider">Intereses</h3>
        </div>
        <textarea 
          value={data.interests.join('\n')} 
          onChange={(e) => updateField('interests', e.target.value.split('\n'))}
          className="w-full p-4 border rounded-2xl text-sm bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none shadow-inner"
          rows={3}
          placeholder="Intereses uno por línea"
        />
      </section>

    </div>
  );
};

export default ContentEditor;
