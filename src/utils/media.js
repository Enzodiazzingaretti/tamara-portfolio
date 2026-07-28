// Detecta si una URL de la galería es un video (para renderizar <video> en vez de <img>).
const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;
export const isVideo = (url) => typeof url === "string" && VIDEO_RE.test(url);

// URL de la miniatura (~600px) que genera el script por cada imagen: mismo nombre
// + "-thumb". Se usa en tiles/portadas/grid; el full va al lightbox. Si no existe
// (ej. imágenes subidas desde el admin), el <img> hace fallback al original.
export const thumb = (url) =>
  typeof url === "string" && /\.webp$/i.test(url) ? url.replace(/\.webp$/i, "-thumb.webp") : url;
