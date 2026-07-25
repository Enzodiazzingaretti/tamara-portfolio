import ReorderableList from "../ReorderableList";
import TextField from "../fields/TextField";
import TextArea from "../fields/TextArea";
import { SERVICE_ICONS } from "../icons";

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
          <label className="block mb-1">
            <span className="block text-xs uppercase tracking-wide text-mauve mb-1">Ícono</span>
            <select value={item.icon} onChange={(e) => patch({ icon: e.target.value })}
              className="w-full rounded-lg bg-burgundy/60 border border-plum px-3 py-2 text-cream focus:outline-none focus:border-dusty">
              {SERVICE_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </label>
        </div>
      )}
    />
  );
}
