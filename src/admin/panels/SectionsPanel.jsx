import Toggle from "../fields/Toggle";

const LABELS = { portfolio: "Portfolio", services: "Servicios", process: "Proceso", about: "Sobre mí", contact: "Contacto" };

export default function SectionsPanel({ draft, update }) {
  return (
    <div>
      {Object.keys(draft.sections).map((k) => (
        <Toggle key={k} label={LABELS[k] || k} checked={draft.sections[k]} onChange={(v) => update(["sections", k], v)} />
      ))}
    </div>
  );
}
