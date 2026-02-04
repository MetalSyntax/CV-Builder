import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeProps {
  data: ResumeData;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  profileImage: string;
}

const Resume: React.FC<ResumeProps> = ({ 
  data, 
  primaryColor, 
  accentColor, // Used for headers and important text
  textColor, // Used for body text
  profileImage 
}) => {
  return (
    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none print:w-full overflow-hidden relative font-sans">
      
      {/* Header Section */}
      <header style={{ backgroundColor: primaryColor }} className="text-white pt-10 pb-6 px-10 relative">
        <div className="flex justify-between items-start">
          <div className="w-[70%]">
            <h1 className="text-4xl font-bold uppercase mb-2 tracking-wide leading-tight">
              {data.name}
            </h1>
            <p className="text-lg opacity-90 mb-4 font-light border-b border-white/30 pb-2 inline-block">
              {data.title}
            </p>
            <p className="text-sm leading-relaxed opacity-95 max-w-[90%] text-justify">
              {data.summary}
            </p>
          </div>
          
          {/* Profile Image - Positioned absolute/floating in header or flex based on design */}
          <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shrink-0 shadow-lg absolute right-10 top-8 z-10">
            <img 
              src={profileImage} 
              alt={data.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Contact Bar */}
      <div className="bg-gray-800 text-white py-3 px-10 flex flex-wrap gap-6 items-center text-xs justify-start print:bg-gray-800 print:text-white print:py-3">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-pink-500" />
          <span>{data.contact.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-pink-500" />
          <span>{data.contact.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-pink-500" />
          <span>{data.contact.location}</span>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <main className="grid grid-cols-3 gap-8 p-10 print:p-8">
        
        {/* Left Column (Main) */}
        <div className="col-span-2 space-y-8">
          
          {/* Education */}
          <section>
            <h2 
              style={{ color: accentColor, borderBottomColor: accentColor }} 
              className="text-xl font-bold uppercase border-b-2 pb-1 mb-4"
            >
              Educación
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                  <div className="text-sm font-medium text-gray-700">{edu.institution}</div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 italic">
                    <span>{edu.period}</span>
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 
              style={{ color: accentColor, borderBottomColor: accentColor }} 
              className="text-xl font-bold uppercase border-b-2 pb-1 mb-4"
            >
              Experiencia
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                  <div className="font-semibold text-gray-700 uppercase tracking-wide text-sm mb-1">{exp.company}</div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2 italic">
                    <span>{exp.period}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc ml-4 space-y-1">
                    {exp.tasks.map((task, i) => (
                      <li key={i} style={{ color: textColor }} className="text-sm leading-relaxed pl-1">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar info) */}
        <div className="col-span-1 space-y-8">
          
          {/* Skills */}
          <section>
            <h2 
              style={{ color: 'rgb(156 163 175)' }} 
              className="text-xl font-bold uppercase border-b-2 border-gray-300 pb-1 mb-4"
            >
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span 
                  key={index} 
                  style={{ backgroundColor: primaryColor }}
                  className="text-white text-xs px-2 py-1 rounded font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section>
            <h2 
              style={{ color: 'rgb(156 163 175)' }} 
              className="text-xl font-bold uppercase border-b-2 border-gray-300 pb-1 mb-4"
            >
              Cursos
            </h2>
            <div className="space-y-3">
              {data.courses.map((course, index) => (
                <div key={index}>
                  <div className="font-bold text-gray-800 text-sm">{course.title} ({course.date})</div>
                  <div className="text-xs text-gray-500 italic">{course.provider}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 
              style={{ color: 'rgb(156 163 175)' }} 
              className="text-xl font-bold uppercase border-b-2 border-gray-300 pb-1 mb-4"
            >
              Idiomas
            </h2>
            <div className="space-y-4">
              {data.languages.map((lang, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm font-bold text-gray-800 mb-1">
                    <span>{lang.language}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{lang.level}</div>
                  {/* Visual Progress Bar (Optional but nice) */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: `${lang.score}%`, backgroundColor: primaryColor }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

           {/* Interests */}
           <section>
            <h2 
              style={{ color: 'rgb(156 163 175)' }} 
              className="text-xl font-bold uppercase border-b-2 border-gray-300 pb-1 mb-4"
            >
              Intereses
            </h2>
            <ul className="list-disc ml-4 space-y-1">
               {data.interests.map((interest, i) => (
                  <li key={i} className="text-sm text-gray-700">
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
