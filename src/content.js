// Defaults embebidos: el sitio nunca queda en blanco aunque falle el fetch.
// La fuente de verdad editable es public/content.json (mismo shape).
export const DEFAULTS = {
  site: {
    name: "Tamara González",
    role: "Artista Visual",
    essence: "El arte como refugio, memoria y transformación.",
    whatsapp: "+54 2613743607",
    whatsappUrl: "https://wa.me/542613743607",
    location: "Mendoza, Argentina",
    domain: "tamara-portfolio-xi.vercel.app",
    socials: {
      instagram: "https://instagram.com/pink.rabbit.daydream",
      behance: "",
      pinterest: "",
    },
  },
  sections: { portfolio: true, services: true, process: true, about: true, contact: true },
  hero: { image: "" },
  about: {
    intro:
      "Soy artista visual. Trabajo entre el tatuaje, la ilustración y la pintura, buscando en cada pieza una forma de contar historias que perduran.",
    body:
      "Mi obra explora la memoria, la emoción y la transformación. Creo que el arte es un refugio: un lugar donde las ideas encuentran cuerpo y las marcas encuentran una voz auténtica. Combino sensibilidad estética con una mirada estratégica para acompañar proyectos desde la idea hasta su ejecución.",
    image: "",
  },
  categories: [
    { id: "tatuajes", title: "Tatuajes", subtitle: "Ilustración", description: "", enabled: true, cover: "", gallery: [] },
    { id: "pinturas", title: "Pinturas", subtitle: "Pintura", description: "", enabled: true, cover: "", gallery: [] },
    { id: "dibujos", title: "Dibujos", subtitle: "Dibujo", description: "", enabled: true, cover: "", gallery: [] },
    { id: "foto", title: "Foto mía", subtitle: "Fotografía", description: "", enabled: true, cover: "", gallery: [] },
  ],
  services: [
    { id: "marketing", title: "Marketing & Branding", description: "Estrategias creativas que conectan marcas con personas y generan impacto.", icon: "Sparkle", enabled: true },
    { id: "ilustracion", title: "Ilustración", description: "Ilustraciones personalizadas que comunican ideas con belleza y propósito.", icon: "Flower2", enabled: true },
    { id: "pintura", title: "Pintura", description: "Obras originales que exploran la memoria, la emoción y la transformación.", icon: "Hexagon", enabled: true },
    { id: "cm", title: "Apartado de C.M.", description: "Gestión de redes sociales con identidad, estrategia y contenido coherente.", icon: "Sparkles", enabled: true },
  ],
  process: [
    { id: "descubrir", step: "01", title: "Descubrir", description: "Escucho tu visión, tus ideas y objetivos para entender tu esencia.", enabled: true },
    { id: "definir", step: "02", title: "Definir", description: "Investigo, analizo y diseño una estrategia con una base sólida.", enabled: true },
    { id: "crear", step: "03", title: "Crear", description: "Desarrollo conceptos y materiales visuales con intención y claridad.", enabled: true },
    { id: "entregar", step: "04", title: "Entregar", description: "Entrego soluciones de alta identidad, listas para generar impacto real.", enabled: true },
  ],
  keywords: ["Tatuajes", "Ilustración", "Pintura", "Marketing & Branding"],
};

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

// Merge profundo. Arrays se reemplazan enteros (para reordenar/borrar desde el panel).
export function mergeContent(defaults, incoming) {
  if (!isObject(incoming)) return defaults;
  const out = Array.isArray(defaults) ? [...defaults] : { ...defaults };
  for (const key of Object.keys(incoming)) {
    const dv = defaults ? defaults[key] : undefined;
    const iv = incoming[key];
    if (isObject(dv) && isObject(iv)) out[key] = mergeContent(dv, iv);
    else out[key] = iv; // escalar o array: reemplaza
  }
  return out;
}

export async function loadContent(fetchImpl = fetch) {
  try {
    const res = await fetchImpl("/content.json", { cache: "no-store" });
    if (!res || !res.ok) return DEFAULTS;
    const json = await res.json();
    return mergeContent(DEFAULTS, json);
  } catch {
    return DEFAULTS;
  }
}
