import { ResumeData } from '../types';
import { INITIAL_DATA } from '../constants';

/**
 * Parséador de archivos TXT para CV Builder.
 * Soporta múltiples formatos de archivos TXT, incluyendo detecciones inteligentes de bloques.
 */
export const parseResumeTxt = (text: string, currentData: ResumeData): ResumeData => {
  const rawLines = text.split(/\r?\n/).map(l => l.trim());
  const lines = rawLines.filter(l => l.length > 0);
  
  const clean = (str: string) => str.replace(/<[^>]*>/g, '').replace(/^-+\s*/, '').replace(/\|$/, '').trim();

  const newData: ResumeData = JSON.parse(JSON.stringify(currentData));
  
  newData.education = [];
  newData.experience = [];
  newData.skills = [];
  newData.courses = [];
  newData.languages = [];
  newData.interests = [];

  let currentSection = 'HEADER';
  let tempBlock: string[] = [];
  let titleFoundInFile = false;

  const flushExperience = () => {
    if (tempBlock.length >= 2) {
      newData.experience.push({
        role: clean(tempBlock[0]),
        company: clean(tempBlock[1] || ''),
        period: clean(tempBlock[2] || ''),
        location: clean(tempBlock[3] || ''),
        tasks: tempBlock.slice(4).map(t => clean(t)).filter(t => t.length > 0)
      });
    }
    tempBlock = [];
  };

  const flushEducation = () => {
    if (tempBlock.length >= 2) {
      newData.education.push({
        degree: clean(tempBlock[0]),
        institution: clean(tempBlock[1] || ''),
        period: clean(tempBlock[2] || ''),
        location: clean(tempBlock[3] || '')
      });
    }
    tempBlock = [];
  };

  const flushCourses = () => {
    if (tempBlock.length >= 1) {
      let title = clean(tempBlock[0]);
      let date = clean(tempBlock.find(l => l.match(/\d{4}/)) || '');
      let provider = '';
      
      const providerLine = tempBlock.find(l => l.toLowerCase().includes('impartido por') || l.toLowerCase().includes('institución'));
      if (providerLine) {
        provider = clean(providerLine.replace(/impartido por:?/i, ''));
      } else if (tempBlock.length >= 2) {
        // Si no hay "Impartido por", el segundo suele ser el proveedor en formatos simples
        provider = clean(tempBlock[1]);
      }

      newData.courses.push({ title, date, provider });
    }
    tempBlock = [];
  };

  const flushAll = () => {
    if (currentSection === 'EDUCATION') flushEducation();
    if (currentSection === 'EXPERIENCE') flushExperience();
    if (currentSection === 'COURSES') flushCourses();
  };

  const isDivider = (l: string) => l && l.includes('----------------');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isDivider(line)) continue;
    
    const upper = line.toUpperCase();
    const rawIdx = rawLines.findIndex((rl, idx) => rl === line && idx >= i); 
    const hasFollowingDivider = rawLines.slice(rawIdx + 1, rawIdx + 3).some(rl => isDivider(rl));

    // Detectores de Cambio de Sección
    if (hasFollowingDivider) {
      if (upper === 'EDUCACIÓN' || upper === 'EDUCATION') { flushAll(); currentSection = 'EDUCATION'; continue; }
      if (upper === 'EXPERIENCIA' || upper === 'EXPERIENCE') { flushAll(); currentSection = 'EXPERIENCE'; continue; }
      if (upper === 'HABILIDADES' || upper === 'SKILLS') { flushAll(); currentSection = 'SKILLS'; continue; }
      if (upper === 'CURSOS' || upper === 'COURSES' || upper.includes('CERTIFICACION')) { flushAll(); currentSection = 'COURSES'; continue; }
      if (upper === 'IDIOMAS' || upper === 'LANGUAGES') { flushAll(); currentSection = 'LANGUAGES'; continue; }
      if (upper.includes('INTERESES')) { flushAll(); currentSection = 'INTERESTS'; continue; }
    }

    // Lógica por Sección
    if (currentSection === 'HEADER') {
      if (i === 0) {
        newData.name = clean(line);
      } else if (line.includes('@')) {
        newData.contact.email = clean(line);
      } else if (line.match(/\+?\d[\d\s-]{7,}/)) {
        newData.contact.phone = clean(line);
      } else if (line.match(/https?:\/\/[^\s]+/) || line.includes('linktr.ee') || line.includes('linkedin.com') || line.includes('github.com')) {
        // Capturar primer link como website principal
        if (!newData.contact.website || newData.contact.website.includes('example.com')) {
          newData.contact.website = clean(line);
        }
      } else if (line.length > 120) { 
        newData.summary = clean(line);
      } else if (line.includes(',') && line.length < 100 && !line.includes('|')) {
        newData.contact.location = clean(line);
      } else if (!titleFoundInFile && line.length < 100) {
        newData.title = clean(line);
        titleFoundInFile = true;
      }
    } 
    else if (currentSection === 'EDUCATION') {
      if (upper === 'CURSOS') { flushEducation(); continue; }
      if (tempBlock.length >= 4) flushEducation();
      tempBlock.push(line);
    }
    else if (currentSection === 'EXPERIENCE') {
      if (upper === 'LOGROS/TAREAS' || upper === 'TAREAS / LOGROS' || line.includes('Logros/Tareas')) continue;
      if (!line.startsWith('-') && tempBlock.length >= 4) flushExperience();
      tempBlock.push(line);
    }
    else if (currentSection === 'SKILLS') {
      newData.skills.push(clean(line));
    }
    else if (currentSection === 'COURSES') {
      const isSingleLine = line.includes('(') && (line.includes('–') || line.includes('-') || line.includes('—'));
      if (isSingleLine) {
        const courseMatch = line.match(/^([^(–-]+)(?:\(([^)]+)\))?\s*[-–—]?\s*(.*)$/);
        if (courseMatch) {
           newData.courses.push({
             title: clean(courseMatch[1]),
             provider: clean(courseMatch[2] || ''),
             date: clean(courseMatch[3] || '')
           });
        }
      } else {
        if (tempBlock.length >= 3) flushCourses();
        tempBlock.push(line);
      }
    }
    else if (currentSection === 'LANGUAGES') {
      const m = line.match(/-?([^-]+)-?\s*\((\d+)\/(\d+)\)/);
      if (m) {
        const score = (parseInt(m[2]) / parseInt(m[3])) * 100;
        newData.languages.push({
          language: m[1].trim(),
          level: score >= 90 ? 'Nativo' : score >= 70 ? 'Avanzado' : 'Intermedio',
          score: score
        });
      }
    }
    else if (currentSection === 'INTERESTS') {
      newData.interests.push(clean(line));
    }
  }

  flushAll();
  return newData;
};
