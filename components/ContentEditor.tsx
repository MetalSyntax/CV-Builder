import React from 'react';
import { ResumeData } from '../types';
import { PersonalForm } from './editor/PersonalForm';
import { AppearanceForm } from './editor/AppearanceForm';
import { SectionManager } from './editor/SectionManager';
import { ExperienceForm } from './editor/ExperienceForm';
import { EducationForm } from './editor/EducationForm';
import { CoursesForm } from './editor/CoursesForm';
import { LanguagesForm } from './editor/LanguagesForm';
import { SkillsForm } from './editor/SkillsForm';
import { InterestsForm } from './editor/InterestsForm';

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

  return (
    <div className="space-y-6 pb-20">
      <SectionManager data={data} updateField={updateField} />
      
      <AppearanceForm 
        data={data} 
        updateField={updateField} 
        updateFontSize={updateFontSize} 
      />

      <PersonalForm 
        data={data} 
        updateField={updateField} 
        updateContact={updateContact} 
      />

      <ExperienceForm 
        data={data} 
        onChange={onChange} 
        onMoveItem={onMoveItem} 
        addItem={addItem} 
        removeItem={removeItem} 
        updateItem={updateItem} 
      />

      <EducationForm 
        data={data} 
        onChange={onChange} 
        onMoveItem={onMoveItem} 
        addItem={addItem} 
        removeItem={removeItem} 
        updateItem={updateItem} 
      />

      <CoursesForm 
        data={data} 
        onChange={onChange} 
        onMoveItem={onMoveItem} 
        addItem={addItem} 
        removeItem={removeItem} 
        updateItem={updateItem} 
      />

      <LanguagesForm 
        data={data} 
        onChange={onChange} 
        onMoveItem={onMoveItem} 
        addItem={addItem} 
        removeItem={removeItem} 
        updateItem={updateItem} 
      />

      <SkillsForm 
        data={data} 
        onChange={onChange} 
        addItem={addItem} 
        updateField={updateField} 
      />

      <InterestsForm 
        data={data} 
        onChange={onChange} 
        addItem={addItem} 
        updateField={updateField} 
      />
    </div>
  );
};

export default ContentEditor;
