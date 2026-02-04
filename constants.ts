import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  name: "Barbra Gabriela Petter Urbina",
  title: "Relaciones Industriales | Entusiasta del Skincare y Maquillaje",
  summary: "Estudiante de Relaciones Industriales con sólida experiencia en atención al cliente y gestión administrativa. Soy una persona creativa, proactiva y responsable, con un marcado interés y conocimiento autodidacta en maquillaje y cuidado de la piel (skincare). Poseo habilidades visuales (Fotografía y Canva) que me permiten cuidar la estética y presentación de productos. Busco aportar mi capacidad de organización y mi orientación al servicio para ofrecer una experiencia excepcional.",
  contact: {
    email: "petterbarbra2@gmail.com",
    phone: "+584142494522",
    location: "Urb. 27 de febrero (Menca de Leoni), Guarenas, Venezuela"
  },
  education: [
    {
      degree: "TSU en Relaciones Industriales",
      institution: "Instituto Universitario de Tecnología Antonio José de Sucre",
      period: "04/2023 - Presente",
      location: "Guarenas, Venezuela"
    },
    {
      degree: "Bachiller en Ciencias",
      institution: "UEP “David W. Fernández Pérez”",
      period: "09/2014 - 08/2019",
      location: "Caucagua, Venezuela"
    }
  ],
  experience: [
    {
      role: "Anfitriona de Eventos y Recepción",
      company: "OPERADORA TURÍSTICA HOTEL HUMBOLDT C.A.",
      period: "02/2022 - 03/2022",
      location: "Caracas",
      tasks: [
        "Garanticé una imagen impecable en el montaje de buffets y eventos, cuidando la presentación visual para huéspedes de alto perfil.",
        "Brindé atención personalizada a huéspedes, identificando sus necesidades y asegurando una experiencia de calidad.",
        "Gestioné reservas vía WhatsApp y optimicé la organización de menús y montaje de buffet.",
        "Administré la caja de recepción durante eventos especiales, garantizando exactitud en los procesos de cobro."
      ]
    },
    {
      role: "Encargada Administrativa",
      company: "PARADADEPIT",
      period: "01/2020 - 01/2022",
      location: "Guatire",
      tasks: [
        "Coordiné equipos de trabajo para el cumplimiento de metas semanales, demostrando capacidad de respuesta ante imprevistos.",
        "Gestioné inventarios, procesos de compra y digitalización de registros, habilidades claves para el control de stock de productos.",
        "Apoyé en la inducción de personal, asegurando que el equipo conociera los estándares de la empresa."
      ]
    }
  ],
  skills: [
    "Creatividad",
    "Proactiva",
    "Responsable",
    "Microsoft Office",
    "Canva",
    "Fotografía Móvil",
    "Maquillaje",
    "Protección de la piel",
    "Gestión de caja",
    "Manejo de redes sociales",
    "Atención al cliente",
    "Comunicación efectiva",
    "Trabajo en equipo",
    "Liderazgo",
    "Toma de decisiones",
    "Resolución de problemas",
    "Organización",
    "Atención al detalle",
    "Adaptabilidad",
    "Archivista",
    "SAP HCM"
  ],
  courses: [
    {
      title: "Creación de Currículum Vitae",
      date: "05/2025 - 05/2025",
      provider: "Impartido por: Carolina Gayosso en Platzi"
    },
    {
      title: "Introducción a Excel para Principiantes",
      date: "12/2022 - 12/2022",
      provider: "Impartido por: Annie Parente Dodero en Platzi"
    },
    {
      title: "Curso de Fotografía con tu Celular",
      date: "11/2022 - 11/2022",
      provider: "Impartido por: Giulia Ducci en Platzi"
    },
    {
      title: "Asesor de Belleza",
      date: "12/2025 - 01/2026",
      provider: "Impartido por: Fundación Carlos Slim"
    }
  ],
  languages: [
    { language: "Español", level: "Competencia nativa o bilingüe", score: 100 },
    { language: "Inglés", level: "Competencia laboral limitada", score: 40 }
  ],
  interests: [
    "Maquillaje y Skincare",
    "Gestión de Recursos Humanos",
    "Relaciones Laborales",
    "Reclutamiento y Selección",
    "Comunicación Organizacional"
  ]
};
