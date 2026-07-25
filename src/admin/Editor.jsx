import { useEffect, useState, useCallback } from "react";
import {
  Info, Image as ImageIcon, LayoutGrid, User, Tags, Eye, Sparkles, Workflow,
  Save, Check, Loader2, AlertCircle, LogOut, ExternalLink,
} from "lucide-react";
import { getContent, putContent, logout } from "./api";
import Section from "./Section";
import SitePanel from "./panels/SitePanel";
import AboutPanel from "./panels/AboutPanel";
import KeywordsPanel from "./panels/KeywordsPanel";
import SectionsPanel from "./panels/SectionsPanel";
import ServicesPanel from "./panels/ServicesPanel";
import ProcessPanel from "./panels/ProcessPanel";
import HeroPanel from "./panels/HeroPanel";
import PortfolioPanel from "./panels/PortfolioPanel";

export default function Editor({ onLogout }) {
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getContent().then(setDraft).catch(() => setLoadError("No se pudo cargar el contenido."));
  }, []);

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
    setSaveState("idle");
  }, []);

  async function save() {
    setSaveState("saving");
    try {
      await putContent(draft);
      setDirty(false);
      setSaveState("saved");
    } catch (e) {
      setErrorMsg(e.message);
      setSaveState("error");
    }
  }

  async function doLogout() { await logout().catch(() => {}); onLogout(); }

  if (loadError) {
    return (
      <div className="min-h-screen bg-noir grid place-items-center text-center px-6">
        <div>
          <AlertCircle size={28} className="text-rose mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-cream">{loadError}</p>
          <p className="text-mauve text-sm mt-1">Recargá la página o volvé a entrar.</p>
        </div>
      </div>
    );
  }
  if (!draft) {
    return (
      <div className="min-h-screen bg-noir grid place-items-center text-mauve">
        <Loader2 size={26} className="animate-spin text-dusty" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir text-cream">
      <header className="sticky top-0 z-20 glass-strong border-b border-plum/60">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="leading-tight">
            <h1 className="font-serif text-2xl text-cream">Panel</h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mauve">Tamara González</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SaveStatus dirty={dirty} state={saveState} error={errorMsg} />
            <button
              onClick={save}
              disabled={!dirty || saveState === "saving"}
              className="inline-flex items-center gap-2 rounded-xl bg-dusty text-noir px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40 hover:bg-rose"
            >
              {saveState === "saving" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={1.75} />}
              Guardar
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver el sitio"
              className="grid place-items-center w-10 h-10 rounded-xl border border-plum/60 text-mauve hover:text-dusty hover:border-dusty/40 transition-colors"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
            <button
              onClick={doLogout}
              title="Salir"
              className="grid place-items-center w-10 h-10 rounded-xl border border-plum/60 text-mauve hover:text-rose hover:border-rose/40 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-cream">Contenido del sitio</h2>
          <p className="text-mauve text-sm mt-1">
            Editá todo desde acá. Al guardar, los cambios se publican solos en ~30–60 segundos.
          </p>
        </div>

        <div className="space-y-4">
          <Section title="Datos generales" subtitle="Nombre, contacto y redes" icon={Info} defaultOpen>
            <SitePanel draft={draft} update={update} />
          </Section>
          <Section title="Imágenes" subtitle="Foto del inicio y de «Sobre mí»" icon={ImageIcon}>
            <HeroPanel draft={draft} update={update} />
          </Section>
          <Section title="Portfolio y galerías" subtitle="Categorías, portadas y obras" icon={LayoutGrid}>
            <PortfolioPanel draft={draft} update={update} />
          </Section>
          <Section title="Sobre mí" subtitle="Tu texto de presentación" icon={User}>
            <AboutPanel draft={draft} update={update} />
          </Section>
          <Section title="Palabras clave" subtitle="Etiquetas del sitio" icon={Tags}>
            <KeywordsPanel draft={draft} update={update} />
          </Section>
          <Section title="Secciones visibles" subtitle="Mostrar u ocultar bloques" icon={Eye}>
            <SectionsPanel draft={draft} update={update} />
          </Section>
          <Section title="Servicios" subtitle="Lo que ofrecés" icon={Sparkles}>
            <ServicesPanel draft={draft} update={update} />
          </Section>
          <Section title="Proceso" subtitle="Cómo trabajás" icon={Workflow}>
            <ProcessPanel draft={draft} update={update} />
          </Section>
        </div>
      </main>
    </div>
  );
}

function SaveStatus({ dirty, state, error }) {
  if (state === "saving") {
    return <span className="hidden sm:inline text-sm text-mauve">Guardando…</span>;
  }
  if (state === "error") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-rose" title={error}>
        <AlertCircle size={14} /> Error al guardar
      </span>
    );
  }
  if (state === "saved" && !dirty) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-dusty">
        <Check size={14} /> Guardado
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="hidden sm:inline-flex items-center gap-2 text-sm text-mauve">
        <span className="w-1.5 h-1.5 rounded-full bg-dusty" /> Cambios sin guardar
      </span>
    );
  }
  return null;
}
