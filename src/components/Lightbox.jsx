import { useEffect } from "react";

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
      <button aria-label="Cerrar" onClick={onClose} className="absolute top-4 right-4 text-cream text-2xl">✕</button>
      {images.length > 1 && (
        <>
          <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-cream text-3xl">‹</button>
          <button aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-cream text-3xl">›</button>
        </>
      )}
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-glass-lg" />
    </div>
  );
}
