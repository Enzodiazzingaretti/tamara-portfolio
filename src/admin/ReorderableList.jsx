import { ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from "lucide-react";
import Toggle from "./fields/Toggle";

export function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
export function removeAt(arr, i) { const n = [...arr]; n.splice(i, 1); return n; }

function IconBtn({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid place-items-center w-8 h-8 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? "border-plum/60 text-mauve hover:text-rose hover:border-rose/40"
          : "border-plum/60 text-mauve hover:text-dusty hover:border-dusty/40"
      }`}
    >
      {children}
    </button>
  );
}

export default function ReorderableList({ items, renderItem, onChange, newItem, addLabel = "Agregar", canAddMore = true }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className="rounded-xl border border-plum/60 bg-burgundy/30 overflow-hidden transition-colors hover:border-plum"
        >
          <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-plum/40 bg-wine/30">
            <div className="flex items-center gap-1.5">
              <GripVertical size={15} className="text-mauve/40 mr-1" />
              <IconBtn label="Subir" onClick={() => onChange(move(items, i, i - 1))} disabled={i === 0}>
                <ChevronUp size={16} strokeWidth={1.75} />
              </IconBtn>
              <IconBtn label="Bajar" onClick={() => onChange(move(items, i, i + 1))} disabled={i === items.length - 1}>
                <ChevronDown size={16} strokeWidth={1.75} />
              </IconBtn>
              <span className="ml-1 text-[11px] tabular-nums text-mauve/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle
                label="Visible"
                checked={item.enabled !== false}
                onChange={(v) => { const n = [...items]; n[i] = { ...item, enabled: v }; onChange(n); }}
              />
              <IconBtn label="Eliminar" danger onClick={() => onChange(removeAt(items, i))}>
                <Trash2 size={15} strokeWidth={1.75} />
              </IconBtn>
            </div>
          </div>
          <div className="p-4">
            {renderItem(item, (patch) => { const n = [...items]; n[i] = { ...item, ...patch }; onChange(n); })}
          </div>
        </div>
      ))}
      {canAddMore && (
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-dusty/40 text-dusty py-3 text-sm hover:border-dusty/70 hover:bg-dusty/5 transition-colors"
        >
          <Plus size={16} strokeWidth={1.75} /> {addLabel}
        </button>
      )}
    </div>
  );
}
