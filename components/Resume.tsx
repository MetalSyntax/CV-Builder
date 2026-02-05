import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  textColor: string;
  fontSize: 'sm' | 'base' | 'lg';
  profileImage: string;
}

const Resume: React.FC<ResumeProps> = ({ 
  data, 
  primaryColor, 
  accentColor, 
  contactBarColor,
  textColor, 
  fontSize,
  profileImage 
}) => {
  const { fontSizes } = data;

  return (
    <div 
      id="resume-content"
      style={{ color: textColor, fontSize: `${fontSizes.content}px` }}
      className="bg-white w-[215.9mm] h-[279.4mm] mx-auto shadow-2xl print:shadow-none print:w-[215.9mm] print:h-[279.4mm] print:m-0 print:p-0 overflow-hidden relative font-sans flex-shrink-0"
    >
      
      {/* Header Section */}
      <header style={{ backgroundColor: primaryColor }} className="text-white pt-8 pb-6 px-10 relative">
        <div className="flex justify-between items-center mr-48">
          <div>
            <h1 
              style={{ fontSize: `${fontSizes.name}px` }}
              className="font-bold mb-1 leading-tight"
            >
              {data.name}
            </h1>
            <p 
              style={{ fontSize: `${fontSizes.title}px` }}
              className="opacity-90 mb-3 font-medium"
            >
              {data.title}
            </p>
            <p 
              style={{ fontSize: `${fontSizes.summary}px` }}
              className="leading-tight opacity-95 text-justify max-w-2xl"
            >
              {data.summary}
            </p>
          </div>
        </div>
        
        {/* Profile Image - Absolute positioned */}
        <div className="w-36 h-36 rounded-full border-[6px] border-white/20 overflow-hidden bg-gray-200 shrink-0 shadow-xl absolute right-12 top-6 z-10">
          <img 
            src={profileImage} 
            alt={data.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Contact Bar */}
      <div 
        style={{ backgroundColor: contactBarColor, fontSize: `${fontSizes.contact}px` }} 
        className="text-white py-1.5 px-10 flex gap-6 items-center justify-start"
      >
        <a href={`mailto:${data.contact.email}`} className="flex items-center gap-1.5 hover:underline">
          <Mail size={fontSizes.contact + 2} className="text-white opacity-90" />
          <span>{data.contact.email}</span>
        </a>
        <a href={`tel:${data.contact.phone}`} className="flex items-center gap-1.5 hover:underline">
          <Phone size={fontSizes.contact + 2} className="text-white opacity-90" />
          <span>{data.contact.phone}</span>
        </a>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contact.location)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 hover:underline"
        >
          <MapPin size={fontSizes.contact + 2} className="text-white opacity-90" />
          <span className="max-w-[300px] truncate">{data.contact.location}</span>
        </a>
      </div>

      {/* Main Content Two Columns - 50/50 approx */}
      <main className="grid grid-cols-2 gap-x-12 p-10 pt-6 flex-1">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Education */}
          <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
            >
              EDUCACIÓN
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold leading-tight text-gray-900">{edu.degree}</h3>
                  <div className="font-bold text-gray-700 leading-tight opacity-90">{edu.institution}</div>
                  <div className="flex justify-between text-gray-400 mt-0.5 opacity-80" style={{ fontSize: '0.85em' }}>
                    <span>{edu.period}</span>
                    <span className="italic">{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
            >
              EXPERIENCIA
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold leading-tight text-gray-900">{exp.role}</h3>
                  <div className="font-bold text-gray-700 leading-tight opacity-90">{exp.company}</div>
                  <div className="flex justify-between text-gray-400 mt-0.5 opacity-80" style={{ fontSize: '0.85em' }}>
                    <span>{exp.period}</span>
                    <span className="italic">{exp.location}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className="pl-1">
                        <span className="relative -left-1">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Skills - Tag cloud style */}
          <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
            >
              HABILIDADES
            </h2>
            <div className="flex flex-wrap gap-1 mr-4">
              {data.skills.map((skill, index) => (
                <span 
                  key={index}
                  style={{ backgroundColor: primaryColor }}
                  className="text-white px-2.5 py-0.5 rounded-[4px] font-medium opacity-85"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
            >
              CURSOS
            </h2>
            <div className="space-y-3">
              {data.courses.map((course, index) => (
                <div key={index}>
                  <div className="font-bold leading-tight text-gray-800">{course.title} ({course.date})</div>
                  <div className="text-gray-400 italic font-medium opacity-80" style={{ fontSize: '0.85em' }}>
                    Impartido por: {course.provider.replace('Impartido por: ', '')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100"
            >
              IDIOMAS
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {data.languages.map((lang, index) => {
                const dots = Math.round(lang.score / 20);
                return (
                  <div key={index} className="flex flex-col">
                    <div className="font-bold text-gray-800 leading-tight">{lang.language}</div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div 
                          key={dot} 
                          className={`w-1.5 h-1.5 rounded-full ${dot <= dots ? 'bg-gray-400' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-400 italic font-medium mt-0.5 leading-tight opacity-80" style={{ fontSize: '0.85em' }}>
                      {lang.level}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

           {/* Interests */}
           <section>
            <h2 
              style={{ fontSize: `${fontSizes.sectionHeaders}px` }}
              className="text-gray-400 font-bold uppercase tracking-[0.15em] mb-3 border-b-2 border-gray-100"
            >
              INTERESES PROFESIONALES
            </h2>
            <div className="flex flex-wrap gap-2">
               {data.interests.map((interest, i) => (
                  <div 
                    key={i} 
                    className="bg-white border border-gray-300 rounded-[5px] px-3 py-1 font-medium text-gray-800 shadow-sm whitespace-nowrap"
                  >
                    {interest}
                  </div>
                ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Resume;
