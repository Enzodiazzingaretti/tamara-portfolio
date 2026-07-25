import ReorderableList from "../ReorderableList";
import TextField from "../fields/TextField";
import ImageField from "../ImageField";
import GalleryField from "../GalleryField";

// El slot va a un nombre de archivo en el repo: solo [a-z0-9-].
const slug = (id) => String(id).toLowerCase().replace(/[^a-z0-9-]/g, "-");

export default function PortfolioPanel({ draft, update }) {
  return (
    <ReorderableList
      items={draft.categories}
      onChange={(arr) => update(["categories"], arr)}
      addLabel="categoría"
      newItem={() => ({ id: "cat-" + Date.now(), title: "", subtitle: "", enabled: true, cover: "", gallery: [] })}
      renderItem={(item, patch) => {
        const s = slug(item.id);
        return (
          <div>
            <TextField label="Título" value={item.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Subtítulo" value={item.subtitle} onChange={(v) => patch({ subtitle: v })} />
            <ImageField label="Portada" value={item.cover} slot={"cat-" + s} onChange={(url) => patch({ cover: url })} />
            <GalleryField slot={"gal-" + s} images={item.gallery} onChange={(gallery) => patch({ gallery })} />
          </div>
        );
      }}
    />
  );
}
