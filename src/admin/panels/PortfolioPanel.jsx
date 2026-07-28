import ReorderableList from "../ReorderableList";
import TextField from "../fields/TextField";
import TextArea from "../fields/TextArea";
import GalleryField from "../GalleryField";

// El slot va a un nombre de archivo en el repo: solo [a-z0-9-].
const slug = (id) => String(id).toLowerCase().replace(/[^a-z0-9-]/g, "-");

// Editor de los PROYECTOS de una categoría. Cada proyecto es un trabajo con
// una o varias fotos; la 1ª foto es su portada.
function ProjectsEditor({ catSlug, projects, onChange }) {
  return (
    <div className="mt-2">
      <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-mauve mb-2">
        Proyectos
      </span>
      <ReorderableList
        items={projects || []}
        onChange={onChange}
        addLabel="proyecto"
        newItem={() => ({ id: "proj-" + Date.now(), title: "", enabled: true, cover: "", media: [] })}
        renderItem={(proj, patch) => {
          const ps = slug(proj.id);
          return (
            <div>
              <TextField
                label="Nombre del proyecto (interno, no se muestra en el sitio)"
                value={proj.title}
                onChange={(v) => patch({ title: v })}
              />
              <GalleryField
                slot={(catSlug + "-" + ps).slice(0, 40)}
                images={proj.media}
                onChange={(media) => patch({ media, cover: media[0] || "" })}
              />
              <p className="text-[12px] text-mauve/70 mt-2 leading-relaxed">
                La primera foto es la portada del proyecto. Los videos se agregan con el
                proceso por lote (acá se pueden reordenar y quitar).
              </p>
            </div>
          );
        }}
      />
    </div>
  );
}

export default function PortfolioPanel({ draft, update }) {
  return (
    <ReorderableList
      items={draft.categories}
      onChange={(arr) => update(["categories"], arr)}
      addLabel="categoría"
      newItem={() => ({ id: "cat-" + Date.now(), title: "", subtitle: "", description: "", enabled: true, cover: "", projects: [] })}
      renderItem={(item, patch) => {
        const s = slug(item.id);
        return (
          <div>
            <TextField label="Título" value={item.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Subtítulo" value={item.subtitle} onChange={(v) => patch({ subtitle: v })} />
            <TextArea label="Descripción (se ve al abrir la galería)" value={item.description} onChange={(v) => patch({ description: v })} rows={3} />
            <ProjectsEditor
              catSlug={s}
              projects={item.projects}
              onChange={(projects) => patch({ projects, cover: projects[0]?.cover || "" })}
            />
            <p className="text-[12px] text-mauve/70 mt-2 leading-relaxed">
              La portada de la categoría es la del primer proyecto. Ordená los proyectos
              para cambiarla.
            </p>
          </div>
        );
      }}
    />
  );
}
