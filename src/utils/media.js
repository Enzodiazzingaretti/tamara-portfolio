// Detecta si una URL de la galería es un video (para renderizar <video> en vez de <img>).
const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;
export const isVideo = (url) => typeof url === "string" && VIDEO_RE.test(url);
