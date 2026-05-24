export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  hidden?: boolean;
  collapsed?: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  tasks: string[];
  hidden?: boolean;
  companyDescription?: string;
  companyContact?: string;
  archivedTasks?: string[];
  collapsed?: boolean;
}

export interface CourseItem {
  title: string;
  date: string;
  provider: string;
  hidden?: boolean;
  collapsed?: boolean;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  profileImage?: string;
  hideProfileImage?: boolean;
  language?: 'es' | 'en' | 'pt';
  contact: {
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  courses: CourseItem[];
  languages: { language: string; level: string; score: number; hidden?: boolean }[];
  hiddenSkills?: number[];
  hiddenInterests?: number[];
  interests: string[];
  fontSizes: {
    name: number;
    title: number;
    summary: number;
    sectionHeaders: number;
    content: number;
    contact: number;
  };
  lineHeights?: {
    name?: number;
    title?: number;
    summary?: number;
    sectionHeaders?: number;
    content?: number;
    contact?: number;
  };
  visualSettings?: {
    primaryColor: string;
    accentColor: string;
    contactBarColor: string;
    textColor: string;
    fontSize: 'sm' | 'base' | 'lg';
    contactBarLayout?: 'flex' | 'grid' | 'grid-2x2';
    fontFamily?: string;
  };
  sectionOrder?: string[];
  hiddenSections?: string[];
  columnLayout?: {
    left: string[];
    right: string[];
  };
  columnStyle?: 'balanced' | 'side-left' | 'side-right' | 'single';
  sectionStyle?: 'modern' | 'classic' | 'elegant';
  dateFormat?: string;
  dateRangeSeparator?: string;
  taskLineHeight?: number;
}
