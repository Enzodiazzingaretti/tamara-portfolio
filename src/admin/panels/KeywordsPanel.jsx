import { Trash2, Plus } from "lucide-react";

// Lista de strings simple: editar por índice, agregar y quitar.
export default function KeywordsPanel({ draft, update }) {
  const words = draft.keywords || [];
  const setWords = (next) => update(["keywords"], next);

  return (
    <div className="space-y-2.5">
      {words.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={w}
            onChange={(e) => { const n = [...words]; n[i] = e.target.value; setWords(n); }}
            placeholder="Palabra clave"
            className="flex-1 rounded-xl bg-burgundy/40 border border-plum/70 px-4 py-2.5 text-cream placeholder-mauve/50 outline-none transition-colors focus:border-dusty/80 focus:ring-2 focus:ring-dusty/20"
          />
          <button
            type="button" aria-label="Quitar"
            onClick={() => { const n = [...words]; n.splice(i, 1); setWords(n); }}
            className="grid place-items-center w-9 h-9 shrink-0 rounded-lg border border-plum/60 text-mauve hover:text-rose hover:border-rose/40 transition-colors"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setWords([...words, ""])}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-dusty/40 text-dusty py-2.5 text-sm hover:border-dusty/70 hover:bg-dusty/5 transition-colors"
      >
        <Plus size={16} strokeWidth={1.75} /> Agregar palabra
      </button>
    </div>
  );
}
