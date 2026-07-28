import { thumb } from "../utils/media";

// <img> optimizada para tiles/portadas/grid: carga la miniatura (~600px) y, si no
// existe (p. ej. imágenes subidas desde el admin sin thumb), cae al original.
// lazy + decoding async por defecto; usar eager solo si está sobre el fold.
export default function SmartImage({ src, alt = "", className = "", eager = false }) {
  return (
    <img
      src={thumb(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.dataset.full && el.src !== src) {
          el.dataset.full = "1";
          el.src = src;
        }
      }}
    />
  );
}
