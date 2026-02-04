import { ResumeData } from '../types';

/**
 * Parséador de archivos TXT para CV Builder.
 * Diseñado para procesar exportaciones de texto estructuradas con secciones y bloques líquidos.
 */
export const parseResumeTxt = (text: string, currentData: ResumeData): ResumeData => {
  // Dividimos en líneas, limpiamos espacios y eliminamos líneas vacías para el procesamiento secuencial
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  // Limpiador: elimina tags HTML, guiones iniciales decorativos y espacios extra
  const clean = (str: string) => str.replace(/<[^>]*>/g, '').replace(/^-+\s*/, '').trim();

  // Clonamos el objeto de datos para preservar configuraciones de diseño (colores, etc)
  const newData: ResumeData = JSON.parse(JSON.stringify(currentData));
  
  // Reiniciamos solo los arreglos de contenido para poblarlos desde el archivo
  newData.education = [];
  newData.experience = [];
  newData.skills = [];
  newData.courses = [];
  newData.languages = [];
  newData.interests = [];

  let currentSection = 'HEADER';
  let tempBlock: string[] = [];

  // Funciones auxiliares para guardar bloques acumulados
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
    if (tempBlock.length >= 2) {
      newData.courses.push({
        title: clean(tempBlock[0]),
        date: clean(tempBlock[1] || ''),
        provider: clean(tempBlock[2] || '')
      });
    }
    tempBlock = [];
  };

  const flushAll = () => {
    if (currentSection === 'EDUCATION') flushEducation();
    if (currentSection === 'EXPERIENCE') flushExperience();
    if (currentSection === 'COURSES') flushCourses();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('------------------------')) continue;
    const upper = line.toUpperCase();

    // Detectores de Cambio de Sección
    if (upper === 'EDUCACIÓN' || upper === 'EDUCATION') { flushAll(); currentSection = 'EDUCATION'; continue; }
    if (upper === 'EXPERIENCIA' || upper === 'EXPERIENCE') { flushAll(); currentSection = 'EXPERIENCE'; continue; }
    if (upper === 'HABILIDADES' || upper === 'SKILLS') { flushAll(); currentSection = 'SKILLS'; continue; }
    if (upper === 'CURSOS' || upper === 'COURSES') { flushAll(); currentSection = 'COURSES'; continue; }
    if (upper === 'IDIOMAS' || upper === 'LANGUAGES') { flushAll(); currentSection = 'LANGUAGES'; continue; }
    if (upper.includes('INTERESES')) { flushAll(); currentSection = 'INTERESTS'; continue; }

    // Lógica por Sección
    if (currentSection === 'HEADER') {
      // El nombre suele ser la primera línea real
      if (i === 0) {
        newData.name = clean(line);
      } else if (line.includes('@')) {
        newData.contact.email = clean(line);
      } else if (line.match(/\+?\d[\d\s-]{7,}/)) {
        newData.contact.phone = clean(line);
      } else if (line.includes('|')) {
        newData.title = clean(line);
      } else if (line.length > 100) { 
        // Si es muy largo, es el resumen/perfil
        newData.summary = clean(line);
      } else if (line.includes(',') && line.length < 100) {
        // Si tiene coma y es corto, suele ser la ubicación/dirección
        newData.contact.location = clean(line);
      }
    } 
    else if (currentSection === 'EDUCATION') {
      // Artifactos de 'Cursos' dentro de educación en el ejemplo
      if (upper === 'CURSOS') { flushEducation(); continue; }
      if (tempBlock.length >= 4) flushEducation();
      tempBlock.push(line);
    }
    else if (currentSection === 'EXPERIENCE') {
      if (upper === 'LOGROS/TAREAS' || line.includes('Logros/Tareas')) continue;
      // Detectamos inicio de nuevo cargo: no empieza con guión y ya tenemos datos del anterior
      if (!line.startsWith('-') && tempBlock.length >= 4) flushExperience();
      tempBlock.push(line);
    }
    else if (currentSection === 'SKILLS') {
      newData.skills.push(clean(line));
    }
    else if (currentSection === 'COURSES') {
      if (tempBlock.length >= 3) flushCourses();
      tempBlock.push(line);
    }
    else if (currentSection === 'LANGUAGES') {
      // Formato: -Español- (100/100)
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

  // Limpieza final de bloques pendientes
  flushAll();

  return newData;
};
