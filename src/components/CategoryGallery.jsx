import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Lightbox from "./Lightbox";

// Overlay que muestra TODAS las imágenes de una categoría en un grid masonry.
// Al tocar una imagen abre el Lightbox a pantalla completa para navegarlas.
export default function CategoryGallery({ category, onClose }) {
  const images = category.gallery || [];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Esc cierra la galería solo cuando el lightbox no está abierto (el lightbox
  // maneja su propio Esc).
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
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] uppercase tracking-editorial text-mauve mb-2">{category.subtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream">{category.title}</h2>
          {category.description && (
            <p className="mt-4 text-sm md:text-base text-mauve leading-relaxed">{category.description}</p>
          )}
          <p className="mt-4 text-[11px] uppercase tracking-editorial text-roseGold/70">
            {images.length} {images.length === 1 ? "obra" : "obras"}
          </p>
        </div>

        {/* Masonry grid — preserva el aspecto de cada obra */}
        {images.length > 0 ? (
          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {images.map((url, i) => (
              <motion.button
                key={url}
                type="button"
                onClick={() => setLightboxIndex(i)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-plum/60 hover:border-dusty/50 transition-colors"
              >
                <img
                  src={url}
                  alt={`${category.title} ${i + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="text-mauve text-sm">Próximamente más obras en esta categoría.</p>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </motion.div>
  );
}
