import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  contactBarColor: string;
  textColor: string;
  profileImage: string;
}

const Resume: React.FC<ResumeProps> = ({ 
  data, 
  primaryColor, 
  accentColor, 
  contactBarColor,
  textColor, 
  profileImage 
}) => {
  return (
    <div className="bg-white w-[215.9mm] min-h-[279.4mm] mx-auto shadow-2xl print:shadow-none print:w-[215.9mm] print:h-[279.4mm] print:m-0 print:p-0 overflow-hidden relative font-sans text-gray-800">
      
      {/* Header Section */}
      <header style={{ backgroundColor: primaryColor }} className="text-white pt-8 pb-6 px-10 relative">
        <div className="flex justify-between items-center mr-48">
          <div>
            <h1 className="text-4xl font-bold mb-1 leading-tight">
              {data.name}
            </h1>
            <p className="text-lg opacity-90 mb-3 font-medium">
              {data.title}
            </p>
            <p className="text-[11px] leading-relaxed opacity-95 text-justify max-w-2xl">
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
      <div style={{ backgroundColor: contactBarColor }} className="text-white py-1.5 px-10 flex gap-6 items-center text-[9px] justify-start">
        <div className="flex items-center gap-1.5">
          <Mail size={11} className="text-white opacity-90" />
          <span>{data.contact.email}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone size={11} className="text-white opacity-90" />
          <span>{data.contact.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-white opacity-90" />
          <span className="max-w-[300px] truncate">{data.contact.location}</span>
        </div>
      </div>

      {/* Main Content Two Columns - 50/50 approx */}
      <main className="grid grid-cols-2 gap-x-12 p-10 pt-6 flex-1">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Education */}
          <section>
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              EDUCACIÓN
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-[13px] leading-tight text-gray-900">{edu.degree}</h3>
                  <div className="text-[12px] font-bold text-gray-700 leading-tight">{edu.institution}</div>
                  <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                    <span>{edu.period}</span>
                    <span className="italic">{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              EXPERIENCIA
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold text-[13px] leading-tight text-gray-900">{exp.role}</h3>
                  <div className="font-bold text-[11px] text-gray-700 uppercase leading-tight">{exp.company}</div>
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>{exp.period}</span>
                    <span className="italic">{exp.location}</span>
                  </div>
                  <div className="text-[9px] uppercase font-bold text-gray-400 mb-1 italic">Logros/Tareas</div>
                  <ul className="space-y-1">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className="text-[10px] leading-tight relative pl-3 text-gray-700">
                        <span className="absolute left-0 top-[6px] w-1 h-1 rounded-full bg-gray-400"></span>
                        {task}
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
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              HABILIDADES
            </h2>
            <div className="flex flex-wrap gap-1 mr-4">
              {data.skills.map((skill, index) => (
                <span 
                  key={index}
                  style={{ backgroundColor: primaryColor }}
                  className="text-white text-[9.5px] px-2.5 py-0.5 rounded-[4px] font-medium opacity-85"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section>
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              CURSOS
            </h2>
            <div className="space-y-3">
              {data.courses.map((course, index) => (
                <div key={index}>
                  <div className="font-bold text-[11px] leading-tight text-gray-800">{course.title} ({course.date})</div>
                  <div className="text-[10px] text-gray-400 italic font-medium">Impartido por: {course.provider.replace('Impartido por: ', '')}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              IDIOMAS
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              {data.languages.map((lang, index) => (
                <div key={index}>
                  <div className="text-[11px] font-bold text-gray-800">{lang.language}</div>
                  <div className="text-[9px] text-gray-400 italic font-medium leading-tight">{lang.level}</div>
                </div>
              ))}
            </div>
          </section>

           {/* Interests */}
           <section>
            <h2 className="text-gray-400 text-[14px] font-bold uppercase tracking-[0.15em] mb-2 border-b-2 border-gray-100">
              INTERESES
            </h2>
            <ul className="grid grid-cols-1 gap-0.5">
               {data.interests.map((interest, i) => (
                  <li key={i} className="text-[11px] text-gray-700 font-medium lowercase first-letter:uppercase">
                    {interest}
                  </li>
                ))}
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Resume;
