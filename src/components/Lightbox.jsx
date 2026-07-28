import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { isVideo } from "../utils/media";

export default function Lightbox({ images, index, onClose, onIndexChange }) {
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);
  const next = () => onIndexChange((index + 1) % images.length);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Galería" onClick={onClose}
      className="fixed inset-0 z-[100] bg-noir/95 backdrop-blur grid place-items-center p-6">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 grid place-items-center w-11 h-11 rounded-full border border-roseGold/30 text-cream hover:text-dusty hover:border-dusty/60 bg-noir/60 backdrop-blur transition-colors"
      >
        <X size={20} strokeWidth={1.25} />
      </button>
      {images.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full border border-roseGold/25 text-cream hover:text-dusty hover:border-dusty/60 bg-noir/50 backdrop-blur transition-colors"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Siguiente"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full border border-roseGold/25 text-cream hover:text-dusty hover:border-dusty/60 bg-noir/50 backdrop-blur transition-colors"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}
      {isVideo(images[index]) ? (
        <video src={images[index]} onClick={(e) => e.stopPropagation()}
          autoPlay muted loop playsInline controls
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-glass-lg" />
      ) : (
        <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-glass-lg" />
      )}
    </div>
  );
}
