export const SITE = {
  name: "Tamara González",
  role: "Marketing Digital & Community Management",
  email: "tamara.gonzalez@email.com",
  linkedin: "https://linkedin.com/in/tamara-gonzalez",
  instagram: "https://instagram.com/tamara.mkt",
  cvUrl: "/cv-tamara-gonzalez.pdf",
};

export const ABOUT = {
  intro:
    "Soy una profesional apasionada por la comunicación estratégica, el diseño visual y la creación de experiencias digitales que conectan con las personas.",
  body: "Mi enfoque combina creatividad, organización y una visión centrada en resultados. Creo firmemente que cada marca tiene una historia única que merece ser contada con intención y estética. Me especializo en traducir objetivos de negocio en estrategias de contenido coherentes, construyendo presencias digitales que generan confianza y comunidad.",
};

export const SPECIALTIES = [
  {
    title: "Gestión de Redes Sociales",
    description:
      "Planificación, creación y administración integral de perfiles en las principales plataformas digitales.",
    icon: "Share2",
  },
  {
    title: "Planificación de Contenidos",
    description:
      "Calendarios editoriales estratégicos alineados con los objetivos de marca y las tendencias del mercado.",
    icon: "CalendarDays",
  },
  {
    title: "Marketing Digital",
    description:
      "Estrategias orientadas a resultados que integran paid media, orgánico y análisis de datos.",
    icon: "TrendingUp",
  },
  {
    title: "Copywriting",
    description:
      "Textos persuasivos que capturan la voz de cada marca y generan engagement auténtico.",
    icon: "PenTool",
  },
  {
    title: "Diseño para Redes",
    description:
      "Piezas visuales que respetan la identidad de marca y maximizan el impacto en cada plataforma.",
    icon: "Palette",
  },
  {
    title: "Análisis de Resultados",
    description:
      "Reportes claros y accionables para optimizar el rendimiento de cada estrategia implementada.",
    icon: "BarChart3",
  },
];

// Cada proyecto tiene `concept: true` cuando es una pieza demostrativa (no un
// cliente real). Reemplazá `images` con las rutas de los mockups reales cuando
// los tengas (ej. "/projects/renacer/1.webp") y poné `concept: false` si es
// trabajo real de un cliente.
export const PROJECTS = [
  {
    id: "marca-cosmetica",
    name: "Renacer Cosmética",
    category: "Branding & Social Media",
    concept: true,
    problem:
      "Una marca de cosmética natural necesitaba posicionarse en un mercado saturado, sin identidad digital clara ni estrategia de contenido.",
    solution:
      "Desarrollé una estrategia integral de contenido con identidad visual cohesiva, calendario editorial mensual y gestión de comunidad activa en Instagram y TikTok.",
    result:
      "El concepto proyecta un crecimiento sostenido de comunidad y un engagement por encima del promedio de la industria mediante contenido de valor y constancia editorial.",
    highlights: [
      { value: "+340%", label: "seguidores proyectados" },
      { value: "8.2%", label: "engagement objetivo" },
    ],
    tags: ["Instagram", "TikTok", "Branding", "Content Strategy"],
    images: [],
  },
  {
    id: "estudio-yoga",
    name: "Alma Studio",
    category: "Community Management",
    concept: true,
    problem:
      "Un estudio de yoga boutique quería digitalizar su comunicación y construir una comunidad online que reflejara la experiencia presencial.",
    solution:
      "Creación de contenido audiovisual editorial, stories interactivos diarios y campañas de paid media segmentadas por zona geográfica.",
    result:
      "El plan apunta a duplicar reservas online y sostener una comunidad activa con alta retención mensual a través de contenido cercano y experiencial.",
    highlights: [
      { value: "x2", label: "reservas online (objetivo)" },
      { value: "92%", label: "retención proyectada" },
    ],
    tags: ["Community", "Paid Media", "Content Creation"],
    images: [],
  },
  {
    id: "restaurante-premium",
    name: "Casa Piedra",
    category: "Marketing Digital",
    concept: true,
    problem:
      "Un restaurante de alta gama necesitaba renovar su presencia digital manteniendo la exclusividad de su marca.",
    solution:
      "Rediseño completo de la estrategia digital: fotografía gastronómica profesional, copywriting editorial y campaña de influencers locales.",
    result:
      "El concepto busca aumentar las reservas vía redes y ampliar el alcance orgánico manteniendo una estética premium coherente con la marca.",
    highlights: [
      { value: "+180%", label: "reservas vía redes (objetivo)" },
      { value: "+65%", label: "alcance orgánico" },
    ],
    tags: ["Strategy", "Influencer Marketing", "Photography"],
    images: [],
  },
];

export const EDUCATION = [
  {
    year: "2024",
    title: "Marketing Digital Avanzado",
    institution: "Google Digital Academy",
    type: "certification",
  },
  {
    year: "2024",
    title: "Community Management Profesional",
    institution: "Coderhouse",
    type: "course",
  },
  {
    year: "2023",
    title: "Diseño Gráfico para Redes Sociales",
    institution: "Domestika",
    type: "course",
  },
  {
    year: "2023",
    title: "Copywriting & Storytelling Digital",
    institution: "Platzi",
    type: "course",
  },
  {
    year: "2023",
    title: "Meta Blueprint Certification",
    institution: "Meta",
    type: "certification",
  },
];

export const TOOLS = [
  "Figma",
  "Canva Pro",
  "Meta Business Suite",
  "Google Analytics",
  "Hootsuite",
  "Mailchimp",
  "Adobe Photoshop",
  "CapCut",
];
