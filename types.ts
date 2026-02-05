export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  tasks: string[];
}

export interface CourseItem {
  title: string;
  date: string;
  provider: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  courses: CourseItem[];
  languages: { language: string; level: string; score: number }[];
  interests: string[];
  fontSizes: {
    name: number;
    title: number;
    summary: number;
    sectionHeaders: number;
    content: number;
    contact: number;
  };
}
