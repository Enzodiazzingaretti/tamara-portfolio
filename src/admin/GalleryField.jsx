import { useState } from "react";
import { compressImage } from "../lib/compressImage";
import { uploadImage } from "./api";
import { move, removeAt } from "./ReorderableList";

const SOFT_MAX = 30;

export default function GalleryField({ slot, images, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setError("");
    try {
      const uploaded = [];
      for (const f of files) {
        const dataUrl = await compressImage(f);
        const res = await uploadImage(slot, dataUrl);
        uploaded.push(res.url);
      }
      onChange([...(images || []), ...uploaded]);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const list = images || [];
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-mauve">Galería ({list.length})</span>
        {list.length >= SOFT_MAX && <span className="text-rose text-xs">Muchas fotos: conviene no pasar de {SOFT_MAX}.</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {list.map((url, i) => (
          <div key={url} className="relative group aspect-square rounded-md overflow-hidden border border-plum">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-between p-1 bg-gradient-to-t from-noir/80 to-transparent opacity-0 group-hover:opacity-100 transition">
              <button type="button" aria-label="Antes" onClick={() => onChange(move(list, i, i - 1))} className="text-cream text-xs">←</button>
              <button type="button" aria-label="Quitar" onClick={() => onChange(removeAt(list, i))} className="text-rose text-xs">✕</button>
              <button type="button" aria-label="Después" onClick={() => onChange(move(list, i, i + 1))} className="text-cream text-xs">→</button>
            </div>
          </div>
        ))}
      </div>
      <label className="mt-2 inline-block rounded-lg border border-dusty/50 text-dusty px-3 py-2 text-sm cursor-pointer">
        {busy ? "Subiendo…" : "+ Agregar fotos"}
        <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={busy} />
      </label>
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
    </div>
  );
}
