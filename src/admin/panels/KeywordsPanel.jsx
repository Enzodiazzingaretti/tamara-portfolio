// Lista de strings simple: editar por índice, agregar y quitar.
export default function KeywordsPanel({ draft, update }) {
  const words = draft.keywords || [];
  const setWords = (next) => update(["keywords"], next);

  return (
    <div className="space-y-2">
      {words.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={w}
            onChange={(e) => { const n = [...words]; n[i] = e.target.value; setWords(n); }}
            className="flex-1 rounded-lg bg-burgundy/60 border border-plum px-3 py-2 text-cream placeholder-mauve focus:outline-none focus:border-dusty"
          />
          <button type="button" aria-label="Quitar" onClick={() => { const n = [...words]; n.splice(i, 1); setWords(n); }}
            className="text-rose px-2">🗑</button>
        </div>
      ))}
      <button type="button" onClick={() => setWords([...words, ""])}
        className="w-full rounded-lg border border-dashed border-dusty/50 text-dusty py-2 text-sm">+ Agregar palabra</button>
    </div>
  );
}
