import ImageField from "../ImageField";

export default function HeroPanel({ draft, update }) {
  return (
    <div>
      <ImageField label="Foto del hero" value={draft.hero?.image} slot="hero" onChange={(url) => update(["hero", "image"], url)} />
      <ImageField label="Foto de «Sobre mí»" value={draft.about?.image} slot="about" onChange={(url) => update(["about", "image"], url)} />
    </div>
  );
}
