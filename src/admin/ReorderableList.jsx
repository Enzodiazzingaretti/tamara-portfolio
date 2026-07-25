import Toggle from "./fields/Toggle";

export function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
export function removeAt(arr, i) { const n = [...arr]; n.splice(i, 1); return n; }

export default function ReorderableList({ items, renderItem, onChange, newItem, addLabel = "Agregar", canAddMore = true }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="rounded-lg border border-plum bg-burgundy/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-mauve">
              <button type="button" aria-label="Subir" onClick={() => onChange(move(items, i, i - 1))} className="px-2">↑</button>
              <button type="button" aria-label="Bajar" onClick={() => onChange(move(items, i, i + 1))} className="px-2">↓</button>
            </div>
            <div className="flex items-center gap-3">
              <Toggle label="Visible" checked={item.enabled !== false} onChange={(v) => { const n = [...items]; n[i] = { ...item, enabled: v }; onChange(n); }} />
              <button type="button" aria-label="Eliminar" onClick={() => onChange(removeAt(items, i))} className="text-rose px-2">🗑</button>
            </div>
          </div>
          {renderItem(item, (patch) => { const n = [...items]; n[i] = { ...item, ...patch }; onChange(n); })}
        </div>
      ))}
      {canAddMore && (
        <button type="button" onClick={() => onChange([...items, newItem()])}
          className="w-full rounded-lg border border-dashed border-dusty/50 text-dusty py-2 text-sm">+ {addLabel}</button>
      )}
    </div>
  );
}
