#!/usr/bin/env node
/*
 * Procesa por lote las fotos crudas de una categoría y las prepara para el sitio.
 *
 * Uso:
 *   node scripts/procesar-imagenes.cjs <categoria>
 *   node scripts/procesar-imagenes.cjs tatuajes
 *
 * Qué hace:
 *   1. Lee las imágenes de  imagenes-fuente/<categoria>/  (jpg, png, webp, etc.),
 *      ordenadas por nombre de archivo (alfabético).
 *   2. Las convierte a WebP optimizado (máx 1600px del lado mayor, calidad ~82,
 *      igual criterio que el panel admin) y las escribe en  public/trabajos/
 *      como  <categoria>-01.webp, <categoria>-02.webp, ...
 *   3. Actualiza  public/content.json : reemplaza la "gallery" de esa categoría.
 *      NO toca el "cover" (ese lo elegís vos; ver el mapa que imprime al final).
 *
 * Re-ejecutable: borra sólo los  <categoria>-NN.webp  previos antes de regenerar,
 * así no quedan duplicados. No toca imágenes subidas desde el admin (otros prefijos).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const MAX_DIM = 1600;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB, igual que el admin
const SRC_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".heic", ".heif"]);

async function encodeUnderLimit(pipeline) {
  // Escalera de calidad hasta entrar en el límite de bytes (piso 40).
  for (let q = 82; q >= 40; q -= 8) {
    const buf = await pipeline.clone().webp({ quality: q }).toBuffer();
    if (buf.length <= MAX_BYTES || q === 40) return { buf, quality: q };
  }
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
    console.error(`Creala y copiá ahí las fotos de "${categoria}".`);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => SRC_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }));

  if (!files.length) {
    console.error(`No hay imágenes en ${srcDir}. Copiá ahí las fotos y volvé a correr.`);
    process.exit(1);
  }

  // Limpiar salidas previas de esta categoría (sólo <categoria>-NN.webp).
  const prevRe = new RegExp(`^${categoria}-\\d+\\.webp$`);
  for (const f of fs.readdirSync(outDir)) {
    if (prevRe.test(f)) fs.unlinkSync(path.join(outDir, f));
  }

  const gallery = [];
  const mapa = [];
  const pad = String(files.length).length; // 01..09 o 001..
  let i = 0;
  for (const file of files) {
    i += 1;
    const n = String(i).padStart(Math.max(2, pad), "0");
    const outName = `${categoria}-${n}.webp`;
    const pipeline = sharp(path.join(srcDir, file))
      .rotate() // respeta orientación EXIF
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true });
    const { buf, quality } = await encodeUnderLimit(pipeline);
    fs.writeFileSync(path.join(outDir, outName), buf);
    const url = `/trabajos/${outName}`;
    gallery.push(url);
    const kb = (buf.length / 1024).toFixed(0);
    mapa.push({ n, original: file, salida: outName, url, kb, quality });
  }

  // Actualizar content.json
  const contentPath = path.join(ROOT, "public", "content.json");
  const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
  const cat = (content.categories || []).find((c) => c.id === categoria);
  if (!cat) {
    console.error(`\nOJO: no encontré la categoría id="${categoria}" en content.json.`);
    console.error("Las imágenes se generaron igual en public/trabajos/, pero no toqué el JSON.");
  } else {
    cat.gallery = gallery;
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n", "utf8");
  }

  // Reporte
  console.log(`\n✓ Procesadas ${files.length} imágenes para "${categoria}"\n`);
  console.log("  #   original                         → salida            tamaño   q");
  console.log("  " + "-".repeat(74));
  for (const m of mapa) {
    console.log(
      `  ${m.n}  ${m.original.padEnd(32).slice(0, 32)} → ${m.salida.padEnd(18)} ${String(m.kb + "KB").padStart(7)}  ${m.quality}`
    );
  }
  console.log(`\n  Gallery escrita en content.json (${gallery.length} fotos).`);
  console.log(`  Para el COVER, decime qué número (#) de la lista usar y lo cargo.\n`);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
