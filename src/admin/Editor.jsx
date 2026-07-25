import { useEffect, useState, useCallback } from "react";
import { getContent, putContent, logout } from "./api";
import Section from "./Section";
import SitePanel from "./panels/SitePanel";
import AboutPanel from "./panels/AboutPanel";
import KeywordsPanel from "./panels/KeywordsPanel";
import SectionsPanel from "./panels/SectionsPanel";
import ServicesPanel from "./panels/ServicesPanel";
import ProcessPanel from "./panels/ProcessPanel";

export default function Editor({ onLogout }) {
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => { getContent().then(setDraft).catch(() => setStatus("No se pudo cargar el contenido.")); }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = useCallback((path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
  }, []);

  async function save() {
    setStatus("Guardando…");
    try { await putContent(draft); setDirty(false); setStatus("Guardado ✓"); }
    catch (e) { setStatus("Error: " + e.message); }
  }

  async function doLogout() { await logout().catch(() => {}); onLogout(); }

  if (!draft) return <div className="min-h-screen bg-noir grid place-items-center text-mauve">{status || "Cargando…"}</div>;

  return (
    <div className="min-h-screen bg-noir text-cream">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-wine/90 backdrop-blur border-b border-plum">
        <h1 className="font-serif text-2xl">Panel · Tamara</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-mauve">{status}</span>
          <button onClick={save} disabled={!dirty} className="rounded-lg bg-dusty text-noir px-4 py-2 text-sm font-medium disabled:opacity-50">Guardar cambios</button>
          <button onClick={doLogout} className="rounded-lg border border-plum px-3 py-2 text-sm text-mauve">Salir</button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <Section title="Datos generales" defaultOpen><SitePanel draft={draft} update={update} /></Section>
        <Section title="Sobre mí"><AboutPanel draft={draft} update={update} /></Section>
        <Section title="Palabras clave"><KeywordsPanel draft={draft} update={update} /></Section>
        <Section title="Secciones visibles"><SectionsPanel draft={draft} update={update} /></Section>
        <Section title="Servicios"><ServicesPanel draft={draft} update={update} /></Section>
        <Section title="Proceso"><ProcessPanel draft={draft} update={update} /></Section>
      </main>
    </div>
  );
}
