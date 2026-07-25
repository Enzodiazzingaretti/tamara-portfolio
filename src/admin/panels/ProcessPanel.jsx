import ReorderableList from "../ReorderableList";
import TextField from "../fields/TextField";
import TextArea from "../fields/TextArea";

export default function ProcessPanel({ draft, update }) {
  return (
    <ReorderableList
      items={draft.process}
      onChange={(arr) => update(["process"], arr)}
      addLabel="paso"
      newItem={() => ({ id: "stp-" + Date.now(), step: "", title: "", description: "", enabled: true })}
      renderItem={(item, patch) => (
        <div>
          <TextField label="Número (ej. 01)" value={item.step} onChange={(v) => patch({ step: v })} />
          <TextField label="Título" value={item.title} onChange={(v) => patch({ title: v })} />
          <TextArea label="Descripción" value={item.description} onChange={(v) => patch({ description: v })} rows={2} />
        </div>
      )}
    />
  );
}
