import { useState } from "react";
import { Upload, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { compressImage } from "../lib/compressImage";
import { uploadImage } from "./api";

export default function ImageField({ label, value, slot, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const dataUrl = await compressImage(file);
      const res = await uploadImage(slot, dataUrl);
      onChange(res.url);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return (
    <div className="mb-5">
      <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-mauve mb-1.5">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 shrink-0 rounded-xl bg-burgundy/50 border border-plum/70 overflow-hidden grid place-items-center">
          {busy ? (
            <Loader2 size={20} className="text-dusty animate-spin" />
          ) : value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-mauve/50" strokeWidth={1.25} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2 rounded-xl border border-dusty/40 text-dusty px-4 py-2.5 text-sm cursor-pointer hover:border-dusty/70 hover:bg-dusty/5 transition-colors">
            <Upload size={15} strokeWidth={1.75} />
            {busy ? "Subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-mauve hover:text-rose text-xs transition-colors self-start px-1"
            >
              <Trash2 size={13} strokeWidth={1.75} /> Quitar
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-rose text-sm mt-2">{error}</p>}
    </div>
  );
}
