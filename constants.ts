import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  name: "John Doe Lorem",
  title: "Lorem Ipsum Dolor | Consectetur Adipiscing Elit",
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  contact: {
    email: "lorem.ipsum@example.com",
    phone: "+00 123 456 789",
    location: "Lorem Ipsum Street, City, Country"
  },
  education: [
    {
      degree: "Lorem Ipsum Degree",
      institution: "Lorem Ipsum University",
      period: "01/2020 - 12/2023",
      location: "Lorem City"
    },
    {
      degree: "Secondary Education Lorem",
      institution: "Lorem Ipsum School",
      period: "09/2014 - 06/2019",
      location: "Lorem Town"
    }
  ],
  experience: [
    {
      role: "Lorem Ipsum Role",
      company: "LOREM CORP",
      period: "01/2022 - Present",
      location: "Lorem Office",
      tasks: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
      ]
    },
    {
      role: "Junior Lorem Developer",
      company: "IPSUM LTD",
      period: "01/2020 - 12/2021",
      location: "Remote",
      tasks: [
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur."
      ]
    }
  ],
  skills: [
    "Lorem", "Ipsum", "Dolor", "Sit Amet", "Consectetur", "Adipiscing",
    "Elit", "Sed do", "Eiusmod", "Tempor", "Incididunt", "Labore",
    "Et Dolore", "Magna Aliqua", "Ut Enim", "Ad Minim"
  ],
  courses: [
    {
      title: "Lorem Ipsum Certification",
      date: "05/2023",
      provider: "Lorem Provider"
    },
    {
      title: "Advanced Ipsum Course",
      date: "12/2022",
      provider: "Ipsum Institute"
    }
  ],
  languages: [
    { language: "Lorem", level: "Native", score: 100 },
    { language: "Ipsum", level: "Professional", score: 80 }
  ],
  interests: [
    "Lorem Ipsum",
    "Dolor Sit Amet",
    "Consectetur Adipiscing",
    "Tempor Incididunt",
    "Magna Aliqua"
  ]
};
