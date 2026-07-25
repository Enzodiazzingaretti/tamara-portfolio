import { Sparkle, Flower2, Hexagon, Sparkles, Palette, PenTool, Brush, Heart } from "lucide-react";
import ReorderableList from "../ReorderableList";
import TextField from "../fields/TextField";
import TextArea from "../fields/TextArea";
import { SERVICE_ICONS } from "../icons";

// Mismo mapa que ServicesSection: lo que se elige acá es lo que se ve en el sitio.
const ICONS = { Sparkle, Flower2, Hexagon, Sparkles, Palette, PenTool, Brush, Heart };

function IconPicker({ value, onChange }) {
  return (
    <div className="mb-1">
      <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-mauve mb-2">Ícono</span>
      <div className="flex flex-wrap gap-2">
        {SERVICE_ICONS.map((name) => {
          const Ico = ICONS[name] || Sparkle;
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              aria-label={name}
              aria-pressed={active}
              onClick={() => onChange(name)}
              className={`grid place-items-center w-11 h-11 rounded-xl border transition-colors ${
                active
                  ? "border-dusty bg-dusty/15 text-dusty"
                  : "border-plum/60 text-mauve hover:text-cream hover:border-plum"
              }`}
            >
              <Ico size={18} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ServicesPanel({ draft, update }) {
  return (
    <ReorderableList
      items={draft.services}
      onChange={(arr) => update(["services"], arr)}
      addLabel="servicio"
      newItem={() => ({ id: "srv-" + Date.now(), title: "", description: "", icon: "Sparkle", enabled: true })}
      renderItem={(item, patch) => (
        <div>
          <TextField label="Título" value={item.title} onChange={(v) => patch({ title: v })} />
          <TextArea label="Descripción" value={item.description} onChange={(v) => patch({ description: v })} rows={3} />
          <IconPicker value={item.icon} onChange={(name) => patch({ icon: name })} />
        </div>
      )}
    />
  );
}
