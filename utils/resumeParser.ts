import { ResumeData } from '../types';

export const parseResumeTxt = (text: string, currentData: ResumeData): ResumeData => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const newData: ResumeData = { ...currentData };

  // Helper to find section index
  const findSectionStart = (keywords: string[]) => {
    return lines.findIndex(line => keywords.some(k => line.toUpperCase().includes(k)));
  };

  // Sections definitions
  const sections = {
    education: ['EDUCACIÓN', 'EDUCATION', 'FORMACIÓN'],
    experience: ['EXPERIENCIA', 'EXPERIENCE', 'EXPERIENCIA LABORAL'],
    skills: ['HABILIDADES', 'SKILLS', 'APTITUDES'],
    courses: ['CURSOS', 'COURSES', 'CERTIFICACIONES'],
    languages: ['IDIOMAS', 'LANGUAGES'],
    interests: ['INTERESES', 'INTERESTS'],
    summary: ['RESUMEN', 'PERFIL', 'PROFILE', 'SUMMARY', 'SOBRE MÍ'],
    contact: ['CONTACTO', 'CONTACT']
  };

  // Parsing logic is inherently heuristic and brittle for unstructured text.
  // This is a "best effort" parser based on common CV text dumps.

  // 1. Basic Info (First lines usually)
  if (lines.length > 0) newData.name = lines[0];
  if (lines.length > 1 && !isSectionHeader(lines[1], sections)) newData.title = lines[1];

  // Helper to extract content between indices
  const extractSectionLines = (startIndex: number, allStartIndices: number[]) => {
    if (startIndex === -1) return [];
    const nextSectionIndex = allStartIndices
      .filter(idx => idx > startIndex)
      .sort((a, b) => a - b)[0];
    return lines.slice(startIndex + 1, nextSectionIndex || lines.length);
  };

  // Calculate all section indices
  const sectionIndices: Record<string, number> = {};
  Object.entries(sections).forEach(([key, keywords]) => {
    sectionIndices[key] = findSectionStart(keywords);
  });
  const allIndices = Object.values(sectionIndices).filter(i => i !== -1);

  // Parse Summary
  const summaryLines = extractSectionLines(sectionIndices.summary, allIndices);
  if (summaryLines.length > 0) newData.summary = summaryLines.join(' ');

  // Parse Skills (Comma separated or new lines)
  const skillsLines = extractSectionLines(sectionIndices.skills, allIndices);
  if (skillsLines.length > 0) {
    // Check if comma separated
    const combined = skillsLines.join(',');
    newData.skills = combined.split(/,|\n/).map(s => s.trim()).filter(s => s.length > 0);
  }

  // Parse Interests
  const interestsLines = extractSectionLines(sectionIndices.interests, allIndices);
  if (interestsLines.length > 0) {
     newData.interests = interestsLines;
  }
  
  // Parse Contact (Simple email/phone extraction)
  const contactLines = extractSectionLines(sectionIndices.contact, allIndices);
  contactLines.forEach(line => {
    if (line.includes('@')) newData.contact.email = line;
    if (line.match(/\+?\d{9,}/)) newData.contact.phone = line;
    // Assume other lines might be location if not email/phone
    if (!line.includes('@') && !line.match(/\d{9,}/)) newData.contact.location = line;
  });

  return newData;
};

const isSectionHeader = (line: string, sections: any): boolean => {
  const upper = line.toUpperCase();
  return Object.values(sections).some((keywords: any) => keywords.some((k: string) => upper.includes(k)));
};
