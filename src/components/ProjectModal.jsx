import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Play, ArrowLeft } from "lucide-react";
import Lightbox from "./Lightbox";
import SmartImage from "./SmartImage";
import { isVideo } from "../utils/media";

// Modal de un proyecto: muestra todas sus fotos/videos en un grid.
// Si el proyecto tiene una sola pieza, abre el Lightbox directo (y al cerrarlo,
// cierra el proyecto). Cruceta (✕) para salir en la esquina.
export default function ProjectModal({ project, onClose }) {
  const media = project.media || [];
  const single = media.length === 1;
  const [lightboxIndex, setLightboxIndex] = useState(single ? 0 : null);

  // Esc cierra el proyecto (salvo que el lightbox esté abierto en modo grid).
  useEffect(() => {
    if (lightboxIndex !== null) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIndex, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const closeLightbox = () => {
    if (single) onClose(); // en proyecto de 1 pieza, cerrar el lightbox cierra todo
    else setLightboxIndex(null);
  };

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Proyecto ${project.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[95] bg-noir/98 backdrop-blur-sm overflow-y-auto"
    >
      <button
        aria-label="Cerrar proyecto"
        onClick={onClose}
        className="fixed top-5 right-5 z-10 grid place-items-center w-11 h-11 rounded-full border border-roseGold/30 text-cream hover:text-dusty hover:border-dusty/60 bg-noir/60 backdrop-blur transition-colors"
      >
        <X size={20} strokeWidth={1.25} />
      </button>

      {/* Si es de una sola pieza, no mostramos el grid: el lightbox va directo. */}
      {!single && (
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-16">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-mauve hover:text-dusty transition-colors mb-6"
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> Volver
          </button>
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] uppercase tracking-editorial text-roseGold/70">
              {media.length} {media.length === 1 ? "imagen" : "imágenes"}
            </p>
          </div>

          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {media.map((url, i) => (
              <motion.button
                key={url}
                type="button"
                onClick={() => setLightboxIndex(i)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-plum/60 hover:border-dusty/50 transition-colors"
              >
                {isVideo(url) ? (
                  <>
                    <video
                      src={url}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      autoPlay muted loop playsInline preload="metadata"
                    />
                    <span className="absolute bottom-2 right-2 grid place-items-center w-7 h-7 rounded-full bg-noir/60 backdrop-blur text-cream pointer-events-none">
                      <Play size={13} strokeWidth={1.5} className="translate-x-[1px]" />
                    </span>
                  </>
                ) : (
                  <SmartImage
                    src={url}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={media}
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </motion.div>,
    document.body
  );
}
