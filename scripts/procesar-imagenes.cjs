#!/usr/bin/env node
/*
 * Procesa por lote las fotos y VIDEOS crudos de una categoría para el sitio.
 *
 * Uso:
 *   node scripts/procesar-imagenes.cjs <categoria>
 *   node scripts/procesar-imagenes.cjs tatuajes
 *
 * Qué hace:
 *   1. Lee todo de  imagenes-fuente/<categoria>/  (jpg/png/webp + mp4/mov/webm...),
 *      ordenado por nombre de archivo (alfabético, numérico-aware).
 *   2. Imágenes -> WebP optimizado (máx 1600px, calidad ~82, como el panel admin).
 *      Videos   -> MP4 optimizado, SIN AUDIO (-an), máx 1280px del lado mayor,
 *                  H.264 crf 26, faststart (listo para web).
 *      Salida en  public/trabajos/  como  <categoria>-01.webp / <categoria>-02.mp4 ...
 *   3. Actualiza  public/content.json : reemplaza la "gallery" de esa categoría
 *      (mezcla imágenes y videos en un solo orden). NO toca el "cover".
 *
 * Re-ejecutable: borra sólo los  <categoria>-NN.(webp|mp4)  previos antes de regenerar.
 * No toca imágenes subidas desde el admin (usan otros prefijos: gal-/cat-).
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");
const ffmpeg = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const IMG_MAX_DIM = 1600;
const IMG_MAX_BYTES = 2 * 1024 * 1024; // 2 MB, igual que el admin
const VID_MAX_DIM = 1280;
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".heic", ".heif"]);
const VID_EXT = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"]);

async function encodeImageUnderLimit(pipeline) {
  for (let q = 82; q >= 40; q -= 8) {
    const buf = await pipeline.clone().webp({ quality: q }).toBuffer();
    if (buf.length <= IMG_MAX_BYTES || q === 40) return { buf, quality: q };
  }
}

function processVideo(inPath, outPath) {
  // -an  = descartar TODO el audio (garantía de "sin audio", sin importar el original).
  // scale: reduce el lado mayor a VID_MAX_DIM sin agrandar; dimensiones pares (H.264).
  const vf =
    `scale='if(gt(iw,ih),min(${VID_MAX_DIM},iw),-2)':'if(gt(iw,ih),-2,min(${VID_MAX_DIM},ih))'`;
  execFileSync(
    ffmpeg,
    [
      "-y", "-loglevel", "error",
      "-i", inPath,
      "-an",
      "-vf", vf,
      "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      outPath,
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
}

async function main() {
  const categoria = (process.argv[2] || "").trim();
  if (!categoria || !/^[a-z0-9-]+$/.test(categoria)) {
    console.error("Uso: node scripts/procesar-imagenes.cjs <categoria>  (ej. tatuajes)");
    process.exit(1);
  }

  const srcDir = path.join(ROOT, "imagenes-fuente", categoria);
  const outDir = path.join(ROOT, "public", "trabajos");
  if (!fs.existsSync(srcDir)) {
    console.error(`No existe la carpeta de fotos crudas: ${srcDir}`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const entries = fs
    .readdirSync(srcDir)
    .map((f) => ({ f, ext: path.extname(f).toLowerCase() }))
    .filter((e) => IMG_EXT.has(e.ext) || VID_EXT.has(e.ext))
    .sort((a, b) => a.f.localeCompare(b.f, "es", { numeric: true, sensitivity: "base" }));

  if (!entries.length) {
    console.error(`No hay imágenes ni videos en ${srcDir}.`);
    process.exit(1);
  }

  // Limpiar salidas previas de esta categoría (sólo <categoria>-NN.webp|mp4).
  const prevRe = new RegExp(`^${categoria}-\\d+\\.(webp|mp4)$`);
  for (const f of fs.readdirSync(outDir)) {
    if (prevRe.test(f)) fs.unlinkSync(path.join(outDir, f));
  }

  const gallery = [];
  const mapa = [];
  const pad = Math.max(2, String(entries.length).length);
  let i = 0;
  for (const { f, ext } of entries) {
    i += 1;
    const n = String(i).padStart(pad, "0");
    const isVideo = VID_EXT.has(ext);
    const outName = `${categoria}-${n}.${isVideo ? "mp4" : "webp"}`;
    const outPath = path.join(outDir, outName);

    if (isVideo) {
      processVideo(path.join(srcDir, f), outPath);
    } else {
      const pipeline = sharp(path.join(srcDir, f))
        .rotate()
        .resize({ width: IMG_MAX_DIM, height: IMG_MAX_DIM, fit: "inside", withoutEnlargement: true });
      const { buf } = await encodeImageUnderLimit(pipeline);
      fs.writeFileSync(outPath, buf);
    }

    const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
    const url = `/trabajos/${outName}`;
    gallery.push(url);
    mapa.push({ n, tipo: isVideo ? "video" : "foto", original: f, salida: outName, kb });
  }

  // Actualizar content.json
  const contentPath = path.join(ROOT, "public", "content.json");
  const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
  const cat = (content.categories || []).find((c) => c.id === categoria);
  if (!cat) {
    console.error(`\nOJO: no encontré la categoría id="${categoria}" en content.json.`);
    console.error("Las salidas se generaron en public/trabajos/, pero no toqué el JSON.");
  } else {
    cat.gallery = gallery;
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n", "utf8");
  }

  // Reporte
  console.log(`\n✓ Procesados ${entries.length} archivos para "${categoria}" (videos SIN audio)\n`);
  console.log("  #   tipo   original                              → salida             tamaño");
  console.log("  " + "-".repeat(80));
  for (const m of mapa) {
    console.log(
      `  ${m.n}  ${m.tipo.padEnd(5)}  ${m.original.padEnd(37).slice(0, 37)} → ${m.salida.padEnd(18)} ${String(m.kb + "KB").padStart(8)}`
    );
  }
  console.log(`\n  Gallery escrita en content.json (${gallery.length} items).`);
  console.log(`  Para el COVER, decime qué # usar y lo cargo.\n`);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
