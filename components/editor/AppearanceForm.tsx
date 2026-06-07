import React from 'react';
import { Type, Palette, Layout, Minus, Plus, Calendar, FileText } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { CustomSelect } from '../common/CustomSelect';

interface AppearanceFormProps {
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
  updateFontSize: (field: keyof ResumeData['fontSizes'], value: number) => void;
  contactBarLayout: 'flex' | 'grid' | 'grid-2x2';
  setContactBarLayout: (val: 'flex' | 'grid' | 'grid-2x2') => void;
  fontFamily: string;
  setFontFamily: (val: string) => void;
}

export const AppearanceForm: React.FC<AppearanceFormProps> = ({
  data,
  updateField,
  updateFontSize,
  contactBarLayout,
  setContactBarLayout,
  fontFamily,
  setFontFamily,
}) => {
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
          style={{ fontSize: 'max(12px, 0.625rem)' }}
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

  const templateOptions = [
    { value: 'modern', label: 'Modern (Actual)' },
    { value: 'executive', label: 'Executive Slate' },
    { value: 'timeline', label: 'Minimalist Timeline' },
  ];

  const pageFormatOptions = [
    { value: 'Letter', label: 'Letter (EE.UU.)' },
    { value: 'A4', label: 'A4 (Internacional)' },
  ];

  const pageMarginOptions = [
    { value: 'compact', label: 'Compacto (16px)' },
    { value: 'normal', label: 'Normal (40px)' },
    { value: 'wide', label: 'Ancho (56px)' },
  ];

  const columnOptions = [
    { value: 'balanced', label: 'Equilibrado (2 Col)' },
    { value: 'side-left', label: 'Sidebar Izq' },
    { value: 'side-right', label: 'Sidebar Der' },
    { value: 'single', label: 'Una sola columna' }
  ];

  const styleOptions = [
    { value: 'modern', label: 'Moderno' },
    { value: 'classic', label: 'Clásico' },
    { value: 'elegant', label: 'Elegante' }
  ];

  const dateFormatOptions = [
    { value: 'MM/YYYY', label: 'MM / YYYY' },
    { value: 'YYYY-MM', label: 'YYYY - MM' },
    { value: 'MMM YYYY', label: 'Ene 2024' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'TEXT', label: 'Texto libre' }
  ];

  const separatorOptions = [
    { value: ' - ', label: 'Guion ( - )' },
    { value: ' a ', label: 'Palabra ( a )' },
    { value: ' / ', label: 'Slash ( / )' },
    { value: ' — ', label: 'Raya ( — )' }
  ];

  const contactBarOptions = [
    { value: 'flex', label: 'Una fila (flex)' },
    { value: 'grid', label: 'Dos filas (3 col - grid)' },
    { value: 'grid-2x2', label: 'Dos filas (2 col - grid)' }
  ];

  const fontOptions = [
    { value: 'Ubuntu', label: 'Ubuntu' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'Playfair Display', label: 'Playfair Display' },
  ];

  return (
    <>
      <EditorFormSection title="Plantilla y Página" subtitle="Diseño y formato del documento" icon={Layout}>
        <div className="space-y-4">
          <CustomSelect
            label="Plantilla"
            icon={<Palette size={10} />}
            value={data.template || 'modern'}
            options={templateOptions}
            onChange={(val) => updateField('template', val)}
          />
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect
              label="Formato"
              icon={<FileText size={10} />}
              value={data.pageFormat || 'Letter'}
              options={pageFormatOptions}
              onChange={(val) => updateField('pageFormat', val)}
            />
            <CustomSelect
              label="Márgenes"
              icon={<Layout size={10} />}
              value={data.pageMargin || 'normal'}
              options={pageMarginOptions}
              onChange={(val) => updateField('pageMargin', val)}
            />
          </div>
        </div>
      </EditorFormSection>

      <EditorFormSection title="Distribución y Estilo" subtitle="Personaliza la estructura visual" icon={Palette}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect 
              label="Columnas" 
              icon={<Layout size={10} />} 
              value={data.columnStyle || 'balanced'} 
              options={columnOptions} 
              onChange={(val) => updateField('columnStyle', val)} 
            />
            <CustomSelect 
              label="Estilo" 
              icon={<Palette size={10} />} 
              value={data.sectionStyle || 'modern'} 
              options={styleOptions} 
              onChange={(val) => updateField('sectionStyle', val)} 
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect 
              label="Fechas" 
              icon={<Calendar size={10} />} 
              value={data.dateFormat || 'MM/YYYY'} 
              options={dateFormatOptions} 
              onChange={(val) => updateField('dateFormat', val)} 
            />
            <CustomSelect 
              label="Separador" 
              icon={<Calendar size={10} />} 
              value={data.dateRangeSeparator || ' - '} 
              options={separatorOptions} 
              onChange={(val) => updateField('dateRangeSeparator', val)} 
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomSelect 
              label="Distribución de Contacto" 
              icon={<Layout size={10} />} 
              value={contactBarLayout} 
              options={contactBarOptions} 
              onChange={(val) => setContactBarLayout(val as 'flex' | 'grid' | 'grid-2x2')} 
            />
            <CustomSelect
              label="Fuente del CV"
              icon={<Type size={10} />}
              value={fontFamily}
              options={fontOptions}
              onChange={setFontFamily}
            />
          </div>
        </div>
      </EditorFormSection>

      <EditorFormSection title="Tipografía y Tamaños" icon={Type} subtitle="Ajusta la escala de lectura">
        <CustomSelect
          label="Fuente"
          icon={<Type size={10} />}
          value={fontFamily}
          options={fontOptions}
          onChange={setFontFamily}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <FontSizeControl label="Nombre" value={data.fontSizes.name} field="name" />
          <FontSizeControl label="Título" value={data.fontSizes.title} field="title" />
          <FontSizeControl label="Contacto" value={data.fontSizes.contact} field="contact" />
          <FontSizeControl label="Secciones" value={data.fontSizes.sectionHeaders} field="sectionHeaders" />
          <FontSizeControl label="Resumen" value={data.fontSizes.summary} field="summary" />
          <FontSizeControl label="Contenido" value={data.fontSizes.content} field="content" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 p-1 bg-white dark:bg-zinc-900/30 rounded-md border border-gray-100 dark:border-zinc-800/50 shadow-sm">
          <label className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-black pl-2 tracking-tighter">Interlineado Tareas</label>
          <div className="flex items-center gap-0.5 pr-1">
            <button
              onClick={() => updateField('taskLineHeight', Math.max(0.9, parseFloat(((data.taskLineHeight ?? 1.25) - 0.05).toFixed(2))))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-9 text-center text-[10px] font-bold text-teal-600 dark:text-teal-400">
              {((data.taskLineHeight ?? 1.25)).toFixed(2)}
            </span>
            <button
              onClick={() => updateField('taskLineHeight', Math.min(2.5, parseFloat(((data.taskLineHeight ?? 1.25) + 0.05).toFixed(2))))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </EditorFormSection>
    </>
  );
};
