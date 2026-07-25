// pickQuality es puro y testeable; compressImage usa canvas (verificación en browser).
export function pickQuality(sizeFor, maxBytes, start = 0.82, floor = 0.4, step = 0.1) {
  let q = start;
  while (q > floor && sizeFor(q) > maxBytes) q = Math.round((q - step) * 100) / 100;
  return q;
}

export async function compressImage(file, { maxDim = 1600, maxBytes = 2 * 1024 * 1024 } = {}) {
  const img = await loadImage(file);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  // Aprox bytes desde la longitud del data URL base64 (sin el prefijo "data:...,").
  const sizeFor = (q) => {
    const url = canvas.toDataURL("image/webp", q);
    return (url.length - url.indexOf(",") - 1) * 0.75;
  };
  const q = pickQuality(sizeFor, maxBytes);
  return canvas.toDataURL("image/webp", q);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}
