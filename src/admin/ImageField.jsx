import { useState } from "react";
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
    <div className="mb-4">
      <span className="block text-xs uppercase tracking-wide text-mauve mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg bg-burgundy/60 border border-plum overflow-hidden grid place-items-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-mauve text-xs">sin foto</span>}
        </div>
        <label className="rounded-lg border border-dusty/50 text-dusty px-3 py-2 text-sm cursor-pointer">
          {busy ? "Subiendo…" : "Subir imagen"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="text-rose text-sm">Quitar</button>}
      </div>
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
    </div>
  );
}
