#!/usr/bin/env node
/*
 * Procesa por lote una categoría organizada en PROYECTOS (subcarpetas).
 *
 * Uso:
 *   node scripts/procesar-imagenes.cjs <categoria>
 *   node scripts/procesar-imagenes.cjs tatuajes
 *
 * Estructura esperada:
 *   imagenes-fuente/<categoria>/<proyecto>/<archivos...>   (una subcarpeta = un trabajo)
 *   imagenes-fuente/<categoria>/proyectos.json  (opcional: orden + títulos)
 *       [ { "folder": "sirena", "title": "Sirena" }, ... ]
 *   Si no hay proyectos.json, cada subcarpeta es un proyecto (título = nombre de carpeta)
 *   y los archivos sueltos en la raíz de la categoría son proyectos de una sola pieza.
 *
 * Dentro de cada proyecto: el 1º archivo (orden alfabético; prefijá "0_" para forzar
 * portada) es el COVER; el resto va en "media". Imágenes -> WebP (máx 1600px, ~q82);
 * videos -> MP4 SIN audio (-an, máx 1280px, H.264 crf 26, faststart).
 *
 * Salida: public/trabajos/<categoria>/<proyecto>-NN.(webp|mp4)
 * Escribe en content.json:  categoria.projects = [{id,title,cover,media[]}]
 *                           categoria.cover     = cover del 1er proyecto
 *                           (borra la vieja categoria.gallery plana)
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");
const ffmpeg = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const IMG_MAX_DIM = 1600, IMG_MAX_BYTES = 2 * 1024 * 1024;
const THUMB_DIM = 600, THUMB_QUALITY = 70; // miniatura para tiles/portadas/grid
const VID_MAX_DIM = 1280;
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".heic", ".heif"]);
const VID_EXT = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"]);

const cmp = (a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" });
const isMedia = (f) => IMG_EXT.has(path.extname(f).toLowerCase()) || VID_EXT.has(path.extname(f).toLowerCase());

async function encodeImageUnderLimit(pipeline) {
  for (let q = 82; q >= 40; q -= 8) {
    const buf = await pipeline.clone().webp({ quality: q }).toBuffer();
    if (buf.length <= IMG_MAX_BYTES || q === 40) return buf;
  }
}

function processVideo(inPath, outPath) {
  const vf = `scale='if(gt(iw,ih),min(${VID_MAX_DIM},iw),-2)':'if(gt(iw,ih),-2,min(${VID_MAX_DIM},ih))'`;
  execFileSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", inPath, "-an", "-vf", vf,
    "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", outPath,
  ], { stdio: ["ignore", "ignore", "inherit"] });
}

// Lista de proyectos: usa proyectos.json si existe; si no, autodetecta.
function readProjects(srcDir) {
  const manifestPath = path.join(srcDir, "proyectos.json");
  if (fs.existsSync(manifestPath)) {
    const list = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    return list.map((p) => ({ folder: p.folder, title: p.title || p.folder }));
  }
  const out = [];
  for (const e of fs.readdirSync(srcDir, { withFileTypes: true }).sort((a, b) => cmp(a.name, b.name))) {
    if (e.isDirectory()) out.push({ folder: e.name, title: e.name });
    else if (e.isFile() && isMedia(e.name)) out.push({ folder: null, file: e.name, title: path.parse(e.name).name });
  }
  return out;
}

async function processMedia(inPath, outPath, isVideo) {
  if (isVideo) {
    processVideo(inPath, outPath);
  } else {
    const buf = await encodeImageUnderLimit(
      sharp(inPath).rotate().resize({ width: IMG_MAX_DIM, height: IMG_MAX_DIM, fit: "inside", withoutEnlargement: true })
    );
    fs.writeFileSync(outPath, buf);
    // Miniatura (mismo nombre + "-thumb"): la usan tiles/portadas/grid; el full va al lightbox.
    const thumb = outPath.replace(/\.webp$/i, "-thumb.webp");
    await sharp(inPath)
      .rotate()
      .resize({ width: THUMB_DIM, height: THUMB_DIM, fit: "inside", withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumb);
  }
  return (fs.statSync(outPath).size / 1024).toFixed(0);
}

async function main() {
  const categoria = (process.argv[2] || "").trim();
  if (!categoria || !/^[a-z0-9-]+$/.test(categoria)) {
    console.error("Uso: node scripts/procesar-imagenes.cjs <categoria>");
    process.exit(1);
  }
  const srcDir = path.join(ROOT, "imagenes-fuente", categoria);
  const outDir = path.join(ROOT, "public", "trabajos", categoria);
  if (!fs.existsSync(srcDir)) { console.error(`No existe: ${srcDir}`); process.exit(1); }

  // Limpieza: subcarpeta de la categoría + viejos archivos planos <cat>-NN.* (modelo anterior).
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const flatRe = new RegExp(`^${categoria}-\\d+\\.(webp|mp4)$`);
  const trabajosRoot = path.join(ROOT, "public", "trabajos");
  for (const f of fs.readdirSync(trabajosRoot)) {
    if (flatRe.test(f)) fs.unlinkSync(path.join(trabajosRoot, f));
  }

  const projects = readProjects(srcDir);
  const outProjects = [];
  const report = [];

  for (const p of projects) {
    const slug = p.folder || path.parse(p.file).name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const files = p.folder
      ? fs.readdirSync(path.join(srcDir, p.folder)).filter(isMedia).sort(cmp)
      : [p.file];
    const baseDir = p.folder ? path.join(srcDir, p.folder) : srcDir;

    const media = [];
    let i = 0;
    for (const f of files) {
      i += 1;
      const isVideo = VID_EXT.has(path.extname(f).toLowerCase());
      const outName = `${slug}-${String(i).padStart(2, "0")}.${isVideo ? "mp4" : "webp"}`;
      const kb = await processMedia(path.join(baseDir, f), path.join(outDir, outName), isVideo);
      media.push(`/trabajos/${categoria}/${outName}`);
      report.push({ proj: p.title, tipo: isVideo ? "video" : "foto", src: f, out: outName, kb });
    }
    outProjects.push({ id: slug, title: p.title, cover: media[0], media });
  }

  // content.json
  const contentPath = path.join(ROOT, "public", "content.json");
  const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
  const cat = (content.categories || []).find((c) => c.id === categoria);
  if (!cat) {
    console.error(`\nOJO: no encontré la categoría id="${categoria}" en content.json.`);
  } else {
    cat.projects = outProjects;
    cat.cover = outProjects[0]?.cover || "";
    delete cat.gallery;
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n", "utf8");
  }

  // Reporte
  const totalMedia = report.length;
  console.log(`\n✓ "${categoria}": ${outProjects.length} proyectos, ${totalMedia} archivos (videos sin audio)\n`);
  for (const pr of outProjects) {
    const nVid = pr.media.filter((m) => m.endsWith(".mp4")).length;
    const extra = pr.media.length > 1 ? ` (${pr.media.length} archivos${nVid ? `, ${nVid} video` : ""})` : "";
    console.log(`  • ${pr.title}${extra}  → cover ${path.basename(pr.cover)}`);
  }
  console.log(`\n  Portada de la categoría: ${path.basename(cat?.cover || "")}\n`);
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
