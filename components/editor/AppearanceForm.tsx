import React from 'react';
import { Type, Palette, Layout, Minus, Plus, Calendar } from 'lucide-react';
import { ResumeData } from '../../types';
import { EditorFormSection } from './EditorFormSection';
import { CustomSelect } from '../common/CustomSelect';

interface AppearanceFormProps {
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
  updateFontSize: (field: keyof ResumeData['fontSizes'], value: number) => void;
}

export const AppearanceForm: React.FC<AppearanceFormProps> = ({
  data,
  updateField,
  updateFontSize
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

  return (
    <>
      <EditorFormSection title="Distribución y Estilo" subtitle="Personaliza la estructura visual" icon={Palette}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-2 gap-4">
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
        </div>
      </EditorFormSection>

      <EditorFormSection title="Tipografía y Tamaños" icon={Type} subtitle="Ajusta la escala de lectura">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <FontSizeControl label="Nombre" value={data.fontSizes.name} field="name" />
          <FontSizeControl label="Título" value={data.fontSizes.title} field="title" />
          <FontSizeControl label="Contacto" value={data.fontSizes.contact} field="contact" />
          <FontSizeControl label="Secciones" value={data.fontSizes.sectionHeaders} field="sectionHeaders" />
          <FontSizeControl label="Resumen" value={data.fontSizes.summary} field="summary" />
          <FontSizeControl label="Contenido" value={data.fontSizes.content} field="content" />
        </div>
      </EditorFormSection>
    </>
  );
};
