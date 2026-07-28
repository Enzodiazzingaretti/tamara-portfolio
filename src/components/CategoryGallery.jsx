import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Play, Images, Plus } from "lucide-react";
import Lightbox from "./Lightbox";
import ProjectModal from "./ProjectModal";
import { isVideo } from "../utils/media";

// Tile de un proyecto dentro del modal de categoría.
function ProjectTile({ project, index, onOpen }) {
  const cover = project.cover || project.media?.[0] || "";
  const count = project.media?.length || 0;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative block w-full text-left rounded-xl overflow-hidden border border-plum/60 hover:border-dusty/50 transition-colors"
    >
      <div className="relative aspect-[3/4] art-placeholder overflow-hidden">
        {cover && (isVideo(cover) ? (
          <video
            src={cover}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            autoPlay muted loop playsInline preload="metadata"
          />
        ) : (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ))}
        {/* Indicativo sutil: cuántas piezas hay / si es video. Sin nombre. */}
        {(count > 1 || isVideo(cover)) && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-noir/55 backdrop-blur px-2 py-1 text-cream/90 text-[11px] tabular-nums pointer-events-none">
            {count > 1 ? <><Images size={12} strokeWidth={1.5} /> {count}</> : <Play size={12} strokeWidth={1.5} className="translate-x-[1px]" />}
          </span>
        )}
        {/* Invitación a clickear: aparece un + al pasar el mouse */}
        <div className="absolute inset-0 flex items-center justify-center bg-noir/0 group-hover:bg-noir/25 transition-colors duration-500">
          <span className="grid place-items-center w-10 h-10 rounded-full border border-cream/50 text-cream opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
            <Plus size={18} strokeWidth={1.25} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// Modal de categoría: muestra la grilla de PROYECTOS. Al abrir un proyecto,
// se muestra su ProjectModal con las demás fotos. Cruceta (✕) para salir.
// Retrocompatible: si la categoría no tiene projects pero sí gallery, muestra el
// masonry plano (comportamiento anterior).
export default function CategoryGallery({ category, onClose }) {
  const projects = (category.projects || []).filter((p) => p.enabled !== false);
  const legacyImages = category.gallery || [];
  const useProjects = projects.length > 0;
  const [openProject, setOpenProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null); // solo modo legacy

  useEffect(() => {
    if (openProject || lightboxIndex !== null) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openProject, lightboxIndex, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const count = useProjects ? projects.length : legacyImages.length;
  const noun = useProjects
    ? (count === 1 ? "proyecto" : "proyectos")
    : (count === 1 ? "obra" : "obras");

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${category.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[90] bg-noir/97 backdrop-blur-sm overflow-y-auto"
    >
      <button
        aria-label="Cerrar galería"
        onClick={onClose}
        className="fixed top-5 right-5 z-10 grid place-items-center w-11 h-11 rounded-full border border-roseGold/30 text-cream hover:text-dusty hover:border-dusty/60 bg-noir/60 backdrop-blur transition-colors"
      >
        <X size={20} strokeWidth={1.25} />
      </button>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] uppercase tracking-editorial text-mauve mb-2">{category.subtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream">{category.title}</h2>
          {category.description && (
            <p className="mt-4 text-sm md:text-base text-mauve leading-relaxed">{category.description}</p>
          )}
          <p className="mt-4 text-[11px] uppercase tracking-editorial text-roseGold/70">
            {count} {noun}
          </p>
        </div>

        {useProjects ? (
          count > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.map((p, i) => (
                <ProjectTile key={p.id} project={p} index={i} onOpen={() => setOpenProject(p)} />
              ))}
            </div>
          ) : (
            <p className="text-mauve text-sm">Próximamente más obras en esta categoría.</p>
          )
        ) : legacyImages.length > 0 ? (
          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {legacyImages.map((url, i) => (
              <motion.button
                key={url}
                type="button"
                onClick={() => setLightboxIndex(i)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-plum/60 hover:border-dusty/50 transition-colors"
              >
                {isVideo(url) ? (
                  <video src={url} className="w-full h-auto object-cover" autoPlay muted loop playsInline preload="metadata" />
                ) : (
                  <img src={url} alt={`${category.title} ${i + 1}`} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="text-mauve text-sm">Próximamente más obras en esta categoría.</p>
        )}
      </div>

      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
      {lightboxIndex !== null && (
        <Lightbox images={legacyImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onIndexChange={setLightboxIndex} />
      )}
    </motion.div>
  );
}
