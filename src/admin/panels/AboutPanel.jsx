import TextArea from "../fields/TextArea";

export default function AboutPanel({ draft, update }) {
  const a = draft.about;
  return (
    <div>
      <TextArea label="Introducción" value={a.intro} onChange={(v) => update(["about", "intro"], v)} rows={3} />
      <TextArea label="Texto" value={a.body} onChange={(v) => update(["about", "body"], v)} rows={6} />
    </div>
  );
}
