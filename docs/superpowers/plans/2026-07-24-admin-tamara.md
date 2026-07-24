# Panel de administración de Tamara — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a Tamara un panel `/admin` para editar todos los textos, imágenes y secciones del portfolio (CRUD + galerías) sin tocar código, manteniendo la estética actual.

**Architecture:** El sitio deja de importar `content.js` en build-time; carga `content.json` (estático en `public/`) en runtime con `no-store` sobre defaults embebidos. Un backend serverless (portado del press kit) escribe `content.json` e imágenes al propio repo vía la GitHub Contents API, con auth por contraseña. Guardar commitea al repo y Vercel redeploya solo: el cambio se publica en ~30-60s (mismo comportamiento que el press kit; no instantáneo, pero automático). El panel es una vista React en `/admin` con la misma paleta.

**Tech Stack:** React 19, Vite 6, Tailwind 3.4, Framer Motion 11, lucide-react, funciones serverless de Vercel (Node), Vitest + @testing-library/react (nuevo).

## Global Constraints

- Deploy: **Vercel**, branch **`main`**. Cada push deploya solo.
- Node/serverless: CommonJS en `api/` (`module.exports`, `require`) — así lo espera Vercel para funciones `.js` sin `"type":"module"` en esa carpeta. El repo raíz es `"type":"module"`, por eso las funciones usan extensión `.js` con `require` vía el runtime de Vercel (igual que el press kit, que ya funciona así).
- El token de GitHub vive SOLO en env de Vercel, nunca en el cliente.
- La API solo escribe `content.json` y rutas de imagen validadas `public/trabajos/<slot>-<digits>.webp`.
- Paleta (tailwind): `noir #0D0709`, `wine #160C10`, `burgundy #241017`, `plum #3A1D28`, `dusty #CFA3AB`, `rose #DDAEB6`, `roseGold #C39A8D`, `cream #ECE0DB`, `mauve #A98693`. Fuentes: `serif` (Cormorant Garamond), `sans` (Inter). El panel usa estos tokens.
- Idioma único: español. Sin multi-idioma.
- Imágenes: webp, ≤2 MB, comprimidas en el cliente. Tope soft ~15/galería, ~40 total.
- El sitio público debe verse **idéntico** al actual cuando `content.json` iguala los defaults.

---

## File Structure

**Nuevos:**
- `public/content.json` — contenido editable (seed = valores actuales).
- `src/content.js` — pasa a exportar `DEFAULTS`, `mergeContent`, `loadContent`.
- `src/ContentContext.jsx` — `ContentProvider` + `useContent()`.
- `src/admin/Admin.jsx` — shell del panel (login o editor).
- `src/admin/Login.jsx` — pantalla de login.
- `src/admin/Editor.jsx` — editor en acordeón + guardado global.
- `src/admin/fields/TextField.jsx`, `TextArea.jsx`, `Toggle.jsx` — inputs base.
- `src/admin/ReorderableList.jsx` — lista con agregar/quitar/reordenar.
- `src/admin/ImageField.jsx` — subida + preview de una imagen.
- `src/admin/GalleryField.jsx` — grilla de imágenes de una categoría.
- `src/admin/api.js` — cliente fetch del panel (`getSession`, `login`, `logout`, `getContent`, `putContent`, `uploadImage`).
- `src/lib/compressImage.js` — canvas → webp bajo el límite.
- `src/components/Lightbox.jsx` — visor de galería accesible.
- `api/_lib.js`, `api/login.js`, `api/logout.js`, `api/session.js`, `api/content.js`, `api/upload.js` — backend.
- `scripts/hash-password.js` — genera el hash de la contraseña.
- `vercel.json` — rewrite de `/admin`.
- `vitest.config.js`, `src/test/setup.js` — test infra.
- `docs/DEPLOY-ADMIN.md` — paso a paso de env vars.

**Modificados:**
- `src/main.jsx` — rutea `/admin` vs sitio; envuelve en `ContentProvider`.
- `src/App.jsx` — render condicional por `sections.*`.
- Los 8 componentes de sección — leen de `useContent()`.
- `package.json` — deps de test + script `test`.

---

## Task 1: Test infrastructure (Vitest + testing-library)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`, `src/test/setup.js`, `src/test/smoke.test.js`

**Interfaces:**
- Produces: script `npm test` (vitest run), entorno jsdom, `@testing-library/jest-dom` cargado.

- [ ] **Step 1: Instalar dependencias de test**

```bash
cd "D:/Disco D/GitHubRepos/tamara-portfolio"
npm install -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Crear `vitest.config.js`**

```js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
  },
});
```

- [ ] **Step 3: Crear `src/test/setup.js`**

```js
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Agregar el script de test a `package.json`**

En `"scripts"`, agregar: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: Crear el smoke test `src/test/smoke.test.js`**

```js
import { describe, it, expect } from "vitest";

describe("test infra", () => {
  it("corre", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Correr y verificar que pasa**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/test/
git commit -m "chore: setup Vitest + testing-library"
```

---

## Task 2: Modelo de contenido y merge puro

Convierte `content.js` en defaults + `mergeContent`. `content.json` (public) es el seed editable.

**Files:**
- Create: `public/content.json`, `src/content.test.js`
- Modify: `src/content.js`

**Interfaces:**
- Produces:
  - `DEFAULTS` — objeto con forma `{ site, sections, hero, about, categories, services, process, keywords }`.
  - `mergeContent(defaults, incoming) -> object` — merge profundo: los objetos se mergean por clave; los **arrays se reemplazan enteros** si `incoming` los trae (así reordenar/borrar en el panel manda); si `incoming` es `null`/no-objeto, devuelve `defaults`.

- [ ] **Step 1: Escribir el test que falla `src/content.test.js`**

```js
import { describe, it, expect } from "vitest";
import { DEFAULTS, mergeContent } from "./content";

describe("DEFAULTS", () => {
  it("tiene las claves de nivel raíz", () => {
    expect(Object.keys(DEFAULTS).sort()).toEqual(
      ["about", "categories", "hero", "keywords", "process", "sections", "services", "site"]
    );
  });
  it("todas las secciones arrancan encendidas", () => {
    expect(DEFAULTS.sections).toEqual({
      portfolio: true, services: true, process: true, about: true, contact: true,
    });
  });
});

describe("mergeContent", () => {
  it("devuelve defaults si incoming es null", () => {
    expect(mergeContent(DEFAULTS, null)).toEqual(DEFAULTS);
  });
  it("pisa strings escalares", () => {
    const out = mergeContent(DEFAULTS, { site: { name: "Nueva" } });
    expect(out.site.name).toBe("Nueva");
    expect(out.site.role).toBe(DEFAULTS.site.role); // no tocado
  });
  it("reemplaza arrays enteros (permite borrar/reordenar)", () => {
    const out = mergeContent(DEFAULTS, { services: [{ id: "x", title: "Solo uno", description: "d", icon: "Sparkle", enabled: true }] });
    expect(out.services).toHaveLength(1);
    expect(out.services[0].title).toBe("Solo uno");
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- content`
Expected: FAIL (mergeContent/ DEFAULTS no exportados).

- [ ] **Step 3: Reescribir `src/content.js`**

```js
// Defaults embebidos: el sitio nunca queda en blanco aunque falle el fetch.
// La fuente de verdad editable es public/content.json (mismo shape).
export const DEFAULTS = {
  site: {
    name: "Tamara González",
    role: "Artista Visual",
    essence: "El arte como refugio, memoria y transformación.",
    whatsapp: "+54 11 1234 5678",
    whatsappUrl: "https://wa.me/5491112345678",
    location: "Buenos Aires, Argentina",
    domain: "tamaragonzalez.com",
    socials: {
      instagram: "https://instagram.com/tamara.arte",
      behance: "https://behance.net/tamaragonzalez",
      pinterest: "https://pinterest.com/tamaragonzalez",
    },
  },
  sections: { portfolio: true, services: true, process: true, about: true, contact: true },
  hero: { image: "" },
  about: {
    intro:
      "Soy artista visual. Trabajo entre el tatuaje, la ilustración y la pintura, buscando en cada pieza una forma de contar historias que perduran.",
    body:
      "Mi obra explora la memoria, la emoción y la transformación. Creo que el arte es un refugio: un lugar donde las ideas encuentran cuerpo y las marcas encuentran una voz auténtica. Combino sensibilidad estética con una mirada estratégica para acompañar proyectos desde la idea hasta su ejecución.",
    image: "",
  },
  categories: [
    { id: "tatuajes", title: "Tatuajes", subtitle: "Ilustración", enabled: true, cover: "", gallery: [] },
    { id: "pinturas", title: "Pinturas", subtitle: "Pintura", enabled: true, cover: "", gallery: [] },
    { id: "dibujos", title: "Dibujos", subtitle: "Dibujo", enabled: true, cover: "", gallery: [] },
    { id: "foto", title: "Foto mía", subtitle: "Fotografía", enabled: true, cover: "", gallery: [] },
  ],
  services: [
    { id: "marketing", title: "Marketing & Branding", description: "Estrategias creativas que conectan marcas con personas y generan impacto.", icon: "Sparkle", enabled: true },
    { id: "ilustracion", title: "Ilustración", description: "Ilustraciones personalizadas que comunican ideas con belleza y propósito.", icon: "Flower2", enabled: true },
    { id: "pintura", title: "Pintura", description: "Obras originales que exploran la memoria, la emoción y la transformación.", icon: "Hexagon", enabled: true },
    { id: "cm", title: "Apartado de C.M.", description: "Gestión de redes sociales con identidad, estrategia y contenido coherente.", icon: "Sparkles", enabled: true },
  ],
  process: [
    { id: "descubrir", step: "01", title: "Descubrir", description: "Escucho tu visión, tus ideas y objetivos para entender tu esencia.", enabled: true },
    { id: "definir", step: "02", title: "Definir", description: "Investigo, analizo y diseño una estrategia con una base sólida.", enabled: true },
    { id: "crear", step: "03", title: "Crear", description: "Desarrollo conceptos y materiales visuales con intención y claridad.", enabled: true },
    { id: "entregar", step: "04", title: "Entregar", description: "Entrego soluciones de alta identidad, listas para generar impacto real.", enabled: true },
  ],
  keywords: ["Tatuajes", "Ilustración", "Pintura", "Marketing & Branding"],
};

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

// Merge profundo. Arrays se reemplazan enteros (para reordenar/borrar desde el panel).
export function mergeContent(defaults, incoming) {
  if (!isObject(incoming)) return defaults;
  const out = Array.isArray(defaults) ? [...defaults] : { ...defaults };
  for (const key of Object.keys(incoming)) {
    const dv = defaults ? defaults[key] : undefined;
    const iv = incoming[key];
    if (isObject(dv) && isObject(iv)) out[key] = mergeContent(dv, iv);
    else out[key] = iv; // escalar o array: reemplaza
  }
  return out;
}
```

- [ ] **Step 4: Crear `public/content.json` (seed = defaults, serializado)**

Copiar el objeto `DEFAULTS` como JSON (mismo contenido). El archivo debe ser JSON válido con esas 8 claves raíz.

- [ ] **Step 5: Correr y verificar que pasa**

Run: `npm test -- content`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content.js src/content.test.js public/content.json
git commit -m "feat: content model con defaults + mergeContent, seed content.json"
```

---

## Task 3: `loadContent()` — fetch + merge en runtime

**Files:**
- Modify: `src/content.js`, `src/content.test.js`

**Interfaces:**
- Consumes: `DEFAULTS`, `mergeContent`.
- Produces: `async loadContent(fetchImpl = fetch) -> object`. Hace `fetchImpl('/content.json', {cache:'no-store'})`; si OK, `mergeContent(DEFAULTS, json)`; si falla el fetch o el parse, devuelve `DEFAULTS`.

- [ ] **Step 1: Agregar tests que fallan**

```js
import { loadContent } from "./content";

describe("loadContent", () => {
  it("mergea el json remoto sobre defaults", async () => {
    const fake = async () => ({ ok: true, json: async () => ({ site: { name: "Remota" } }) });
    const out = await loadContent(fake);
    expect(out.site.name).toBe("Remota");
    expect(out.categories).toHaveLength(4);
  });
  it("cae a defaults si el fetch tira", async () => {
    const fake = async () => { throw new Error("network"); };
    const out = await loadContent(fake);
    expect(out).toEqual(DEFAULTS);
  });
  it("cae a defaults si el response no es ok", async () => {
    const fake = async () => ({ ok: false });
    const out = await loadContent(fake);
    expect(out).toEqual(DEFAULTS);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- content`
Expected: FAIL (loadContent no existe).

- [ ] **Step 3: Implementar en `src/content.js`**

```js
export async function loadContent(fetchImpl = fetch) {
  try {
    const res = await fetchImpl("/content.json", { cache: "no-store" });
    if (!res || !res.ok) return DEFAULTS;
    const json = await res.json();
    return mergeContent(DEFAULTS, json);
  } catch {
    return DEFAULTS;
  }
}
```

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npm test -- content`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content.js src/content.test.js
git commit -m "feat: loadContent con fallback a defaults"
```

---

## Task 4: `ContentProvider` + `useContent()`

**Files:**
- Create: `src/ContentContext.jsx`, `src/ContentContext.test.jsx`

**Interfaces:**
- Consumes: `DEFAULTS`, `loadContent`.
- Produces:
  - `<ContentProvider>{children}</ContentProvider>` — corre `loadContent()` una vez al montar; expone el contenido.
  - `useContent() -> content` — el objeto de contenido (arranca en `DEFAULTS`, se actualiza al llegar el fetch).

- [ ] **Step 1: Test que falla**

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import { ContentProvider, useContent } from "./ContentContext";
import { DEFAULTS } from "./content";

function Probe() {
  const c = useContent();
  return <div>{c.site.name}</div>;
}

describe("ContentProvider", () => {
  it("arranca con defaults y luego mergea el fetch", async () => {
    const original = global.fetch;
    global.fetch = async () => ({ ok: true, json: async () => ({ site: { name: "Desde JSON" } }) });
    render(<ContentProvider><Probe /></ContentProvider>);
    expect(screen.getByText(DEFAULTS.site.name)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Desde JSON")).toBeInTheDocument());
    global.fetch = original;
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- ContentContext`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/ContentContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULTS, loadContent } from "./content";

const Ctx = createContext(DEFAULTS);

export function ContentProvider({ children, initial = DEFAULTS }) {
  const [content, setContent] = useState(initial);
  useEffect(() => {
    let alive = true;
    loadContent().then((c) => { if (alive) setContent(c); });
    return () => { alive = false; };
  }, []);
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export function useContent() {
  return useContext(Ctx);
}
```

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npm test -- ContentContext`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ContentContext.jsx src/ContentContext.test.jsx
git commit -m "feat: ContentProvider + useContent"
```

---

## Task 5: Rewire de los componentes a `useContent()` + secciones condicionales

Cambia cada componente de `import { X } from "../content"` a `const { ... } = useContent()`. El shape nuevo es anidado: `site`, `about`, `categories`, `services`, `process`, `keywords`, `sections`, `hero`. **Gotcha:** `Footer.jsx` construye un array con `SITE.*` a nivel de módulo — hay que moverlo adentro del componente.

**Files:**
- Modify: `src/main.jsx`, `src/App.jsx`, y los 8 componentes de sección.
- Create: `src/App.test.jsx`

**Interfaces:**
- Consumes: `useContent`, `ContentProvider`.
- Produces: sitio data-driven; `App` renderiza cada sección solo si `sections.<x>`.

- [ ] **Step 1: Envolver la app en `ContentProvider` (`src/main.jsx`)**

```jsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContentProvider } from "./ContentContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>,
);
```

- [ ] **Step 2: Rewire de cada componente**

En cada archivo, borrar `import { ... } from "../content"` y agregar `import { useContent } from "../ContentContext";`. Dentro del componente, desestructurar lo que use. Mapeo por archivo:

- `HeroSection.jsx`: `const { site } = useContent();` → reemplazar `SITE.name`→`site.name`, `SITE.role`→`site.role`, `SITE.whatsappUrl`→`site.whatsappUrl`.
- `ServicesSection.jsx`: `const { services } = useContent();` → `SERVICES`→`services`. Filtrar `services.filter(s => s.enabled)`.
- `ProcessSection.jsx`: `const { process } = useContent();` → `PROCESS`→`const steps = process.filter(p => p.enabled);` y usar `steps` (incl. `steps.length`).
- `AboutSection.jsx`: `const { about, site } = useContent();` → `ABOUT.intro`→`about.intro`, `ABOUT.body`→`about.body`, `SITE.*`→`site.*`.
- `ContactSection.jsx`: `const { site, keywords } = useContent();` → `SITE.*`→`site.*` (socials: `site.socials.instagram/behance/pinterest`), `KEYWORDS`→`keywords`.
- `Navbar.jsx`: `const { site } = useContent();` → `SITE.whatsappUrl`→`site.whatsappUrl`.
- `WhatsAppFloat.jsx`: `const { site } = useContent();` → `SITE.whatsappUrl`→`site.whatsappUrl`.
- `Footer.jsx`: `const { site } = useContent();` dentro del componente; construir el array de links adentro: `const links = [{label:"Instagram", href: site.socials.instagram}, {label:"Behance", href: site.socials.behance}, {label:"Pinterest", href: site.socials.pinterest}];`. `SITE.name`→`site.name`.
- `PortfolioSection.jsx`: `const { categories, site } = useContent();` → `CATEGORIES`→`categories.filter(c => c.enabled)`, `SITE.instagram`→`site.socials.instagram`.

Nota: en el shape nuevo las redes viven en `site.socials.*` (antes eran `SITE.instagram` planas). Ajustar cada referencia.

- [ ] **Step 3: Render condicional en `src/App.jsx`**

```jsx
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { useContent } from "./ContentContext";

export default function App() {
  const { sections } = useContent();
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-cream overflow-x-hidden">
        <div className="bg-atmosphere" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Navbar />
        <main className="relative z-10">
          <HeroSection />
          {sections.portfolio && <PortfolioSection />}
          {sections.services && <ServicesSection />}
          {sections.process && <ProcessSection />}
          {sections.about && <AboutSection />}
          {sections.contact && <ContactSection />}
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </MotionConfig>
  );
}
```

- [ ] **Step 4: Test de sección condicional `src/App.test.jsx`**

```jsx
import { render, screen } from "@testing-library/react";
import App from "./App";
import { ContentProvider } from "./ContentContext";
import { DEFAULTS, mergeContent } from "./content";

function renderWith(overrides) {
  const initial = mergeContent(DEFAULTS, overrides);
  return render(<ContentProvider initial={initial}><App /></ContentProvider>);
}

describe("App secciones condicionales", () => {
  it("oculta Proceso si sections.process es false", () => {
    global.fetch = async () => ({ ok: false }); // que no pise el initial
    renderWith({ sections: { ...DEFAULTS.sections, process: false } });
    expect(screen.queryByText("Cómo trabajo")).not.toBeInTheDocument();
  });
});
```

Nota: ajustar el texto buscado (`"Cómo trabajo"`) al encabezado real de `ProcessSection.jsx`; si difiere, usar el que corresponda.

- [ ] **Step 5: Correr tests + build + verificación visual**

Run: `npm test` → PASS. Luego `npm run build` → sin errores.
Verificación manual: `npm run dev`, abrir el sitio, confirmar que se ve idéntico al actual (todas las secciones, textos, links a redes en `site.socials`).

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "refactor: componentes leen de useContent, secciones condicionales"
```

---

## Task 6: `api/_lib.js` (auth + sesión + GitHub) con tests

**Files:**
- Create: `api/_lib.js`, `api/_lib.test.js`

**Interfaces:**
- Produces (export CommonJS): `isConfigured`, `checkPassword`, `sign`, `verify`, `sessionCookie`, `readCookie`, `currentSession`, `requireAuth`, `ghRead`, `ghWrite`, `isAllowedFile`, `isAllowedImagePath`, constantes `COOKIE_NAME`, `SESSION_MS`.
- `isAllowedFile(f)` → true solo para `content.json`.
- `isAllowedImagePath(p)` → true solo `^public/trabajos/[a-z0-9-]+-\d+\.webp$`.
- `sign(payload)`/`verify(token)` → HMAC round-trip; `verify` respeta `exp`.

- [ ] **Step 1: Tests que fallan `api/_lib.test.js`**

```js
import { describe, it, expect, beforeAll } from "vitest";
const lib = require("./_lib.js");

beforeAll(() => { process.env.SESSION_SECRET = "test-secret-para-hmac"; });

describe("isAllowedFile", () => {
  it("permite content.json y nada más", () => {
    expect(lib.isAllowedFile("content.json")).toBe(true);
    expect(lib.isAllowedFile("dates.json")).toBe(false);
    expect(lib.isAllowedFile("../secreto")).toBe(false);
  });
});

describe("isAllowedImagePath", () => {
  it("solo webp en public/trabajos con slot-digits", () => {
    expect(lib.isAllowedImagePath("public/trabajos/tatuajes-123.webp")).toBe(true);
    expect(lib.isAllowedImagePath("public/trabajos/x.png")).toBe(false);
    expect(lib.isAllowedImagePath("public/trabajos/../x-1.webp")).toBe(false);
    expect(lib.isAllowedImagePath("img/x-1.webp")).toBe(false);
  });
});

describe("sign/verify", () => {
  it("round-trip válido", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() + 10000 });
    expect(lib.verify(token)).toMatchObject({ u: "admin" });
  });
  it("rechaza expirado", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() - 1 });
    expect(lib.verify(token)).toBeNull();
  });
  it("rechaza firma adulterada", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() + 10000 });
    expect(lib.verify(token + "x")).toBeNull();
  });
});
```

Nota: este archivo de test importa CommonJS con `require`; Vitest lo soporta. Si el runner se queja del mix ESM/CJS, agregar `// @vitest-environment node` arriba del archivo.

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- _lib`
Expected: FAIL.

- [ ] **Step 3: Crear `api/_lib.js`**

Portar de `presskit_digital/api/_lib.js` con estos cambios exactos:
- `COOKIE_NAME = 'tamara_session'`.
- `BRANCH` default `'main'`.
- `ALLOWED_FILES = ['content.json']`.
- `isAllowedImagePath`: `/^public\/trabajos\/[a-z0-9-]+-\d+\.webp$/`.
- `ghHeaders` `User-Agent: 'tamara-admin'`.
- Exportar además `readCookie`.

El resto (scrypt `checkPassword`, `sign`/`verify` HMAC, `sessionCookie` HttpOnly/Secure/SameSite=Strict, `ghRead`/`ghWrite` con sha server-side, `requireAuth`) igual que el press kit (ver `presskit_digital/api/_lib.js` como referencia; código completo allí).

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npm test -- _lib`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add api/_lib.js api/_lib.test.js
git commit -m "feat(api): _lib con auth, sesión y GitHub Contents API"
```

---

## Task 7: Script de hash + endpoints de sesión

**Files:**
- Create: `scripts/hash-password.js`, `api/login.js`, `api/logout.js`, `api/session.js`

**Interfaces:**
- Consumes: `api/_lib.js`.
- Produces:
  - `node scripts/hash-password.js <password>` → imprime `scrypt$<salt>$<key>`.
  - `POST api/login` `{password}` → set-cookie sesión si OK; 401 si no.
  - `POST api/logout` → limpia cookie.
  - `GET api/session` → `{authenticated: boolean}`.

- [ ] **Step 1: Portar `scripts/hash-password.js`** (de `presskit_digital/scripts/hash-password.js`, sin cambios).

- [ ] **Step 2: Crear `api/login.js`**

Portar de `presskit_digital/api/login.js`. Verifica `checkPassword`, arma sesión con `sign({ exp: Date.now()+SESSION_MS })`, set-cookie con `sessionCookie`. 401 en fallo. (Rate limiting: ver Task 8b.)

- [ ] **Step 3: Crear `api/logout.js` y `api/session.js`** (de los homónimos del press kit; `session.js` devuelve `{authenticated: !!currentSession(req)}`).

- [ ] **Step 4: Verificar el hash localmente**

Run: `node scripts/hash-password.js prueba123`
Expected: imprime una línea `scrypt$...$...`.

- [ ] **Step 5: Commit**

```bash
git add scripts/hash-password.js api/login.js api/logout.js api/session.js
git commit -m "feat(api): login/logout/session + hash-password"
```

---

## Task 8: `api/content.js` (GET/PUT) con tests de validación

**Files:**
- Create: `api/content.js`, `api/content.test.js`

**Interfaces:**
- Consumes: `requireAuth`, `ghRead`, `ghWrite`, `isAllowedFile`.
- Produces: handler `(req,res)`. `GET` → `{data: <content.json parseado>}`. `PUT {data}` → escribe `content.json`; 400 si `data` no es objeto.

- [ ] **Step 1: Test de validación (con auth y github mockeados) `api/content.test.js`**

```js
// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./_lib.js", () => ({
  requireAuth: () => true,
  isAllowedFile: (f) => f === "content.json",
  ghRead: vi.fn(async () => ({ content: Buffer.from('{"site":{"name":"X"}}').toString("base64") })),
  ghWrite: vi.fn(async () => ({ ok: true })),
}));

const handler = require("./content.js");

function mockRes() {
  return {
    _status: 0, _json: null, _headers: {},
    setHeader(k, v) { this._headers[k] = v; },
    status(c) { this._status = c; return this; },
    json(o) { this._json = o; return this; },
  };
}

describe("api/content PUT", () => {
  it("rechaza data que no es objeto", async () => {
    const res = mockRes();
    await handler({ method: "PUT", body: { data: "no-objeto" } }, res);
    expect(res._status).toBe(400);
  });
  it("acepta data objeto", async () => {
    const res = mockRes();
    await handler({ method: "PUT", body: { data: { site: { name: "Y" } } } }, res);
    expect(res._status).toBe(200);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- api/content`
Expected: FAIL.

- [ ] **Step 3: Crear `api/content.js`**

Portar de `presskit_digital/api/content.js` pero **fijando el archivo a `content.json`** (no leer `file` de la query): `GET` lee `content.json`; `PUT` valida `body.data` objeto y escribe `content.json` con mensaje `update: contenido desde el panel`.

- [ ] **Step 4: Correr y verificar que pasa**

Run: `npm test -- api/content`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add api/content.js api/content.test.js
git commit -m "feat(api): content GET/PUT sobre content.json"
```

---

## Task 8b: Rate limiting de login (mejora sobre el press kit)

**Files:**
- Modify: `api/login.js`
- Create: `api/rateLimit.test.js` (si se extrae helper) o test inline.

**Interfaces:**
- Produces: `api/login.js` limita a 5 intentos por IP cada 10 min (en memoria por instancia). Devuelve 429 al exceder.

- [ ] **Step 1: Test del limiter (extraer `checkRate(ip, now)` puro en `api/_rate.js`)**

```js
// @vitest-environment node
import { describe, it, expect } from "vitest";
const { makeLimiter } = require("./_rate.js");

describe("rate limiter", () => {
  it("bloquea tras 5 intentos en la ventana", () => {
    const limit = makeLimiter(5, 10 * 60 * 1000);
    let now = 1000;
    for (let i = 0; i < 5; i++) expect(limit("1.2.3.4", now)).toBe(true);
    expect(limit("1.2.3.4", now)).toBe(false); // 6to
  });
  it("resetea pasada la ventana", () => {
    const limit = makeLimiter(5, 1000);
    expect(limit("ip", 0)).toBe(true);
    for (let i = 0; i < 4; i++) limit("ip", 0);
    expect(limit("ip", 0)).toBe(false);
    expect(limit("ip", 2000)).toBe(true); // ventana nueva
  });
});
```

- [ ] **Step 2: Correr → falla. Implementar `api/_rate.js`**

```js
// Limiter en memoria por instancia. makeLimiter(max, windowMs) -> (ip, now) => boolean (true = permitido)
function makeLimiter(max, windowMs) {
  const hits = new Map(); // ip -> { count, start }
  return function (ip, now = Date.now()) {
    const rec = hits.get(ip);
    if (!rec || now - rec.start > windowMs) { hits.set(ip, { count: 1, start: now }); return true; }
    if (rec.count >= max) return false;
    rec.count += 1;
    return true;
  };
}
module.exports = { makeLimiter };
```

- [ ] **Step 3: Cablear en `api/login.js`**

Al inicio del módulo: `const { makeLimiter } = require('./_rate'); const allow = makeLimiter(5, 10*60*1000);`. En el handler, antes de chequear password: `const ip = (req.headers['x-forwarded-for']||'').split(',')[0].trim() || 'unknown'; if (!allow(ip)) return res.status(429).json({ error: 'rate_limited' });`.

- [ ] **Step 4: Correr tests → PASS. Commit**

```bash
git add api/_rate.js api/rateLimit.test.js api/login.js
git commit -m "feat(api): rate limiting de login (5/10min por IP)"
```

---

## Task 9: `api/upload.js` (webp al repo) con tests

**Files:**
- Create: `api/upload.js`, `api/upload.test.js`

**Interfaces:**
- Consumes: `requireAuth`, `ghWrite`, `isAllowedImagePath`.
- Produces: `POST {slot, data(base64 webp)}` → escribe `public/trabajos/<slot>-<timestamp>.webp`; devuelve `{ok:true, path}`. Rechaza no-webp, >2 MB, slot inválido.
- Slots permitidos: `hero`, `about`, y `cat-<id>` (cover) y `gal-<id>` (galería) — validados por regex `^[a-z0-9-]+$`.

- [ ] **Step 1: Tests `api/upload.test.js`**

```js
// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

vi.mock("./_lib.js", () => ({
  requireAuth: () => true,
  ghWrite: vi.fn(async () => ({ ok: true })),
  isAllowedImagePath: (p) => /^public\/trabajos\/[a-z0-9-]+-\d+\.webp$/.test(p),
}));

const handler = require("./upload.js");
function mockRes() { return { _s:0,_j:null,setHeader(){},status(c){this._s=c;return this;},json(o){this._j=o;return this;} }; }
// RIFF....WEBP mínimo
const webpB64 = Buffer.concat([Buffer.from("RIFF"), Buffer.from([0,0,0,0]), Buffer.from("WEBP"), Buffer.alloc(4)]).toString("base64");

describe("api/upload", () => {
  it("rechaza slot inválido", async () => {
    const res = mockRes();
    await handler({ method:"POST", body:{ slot:"../x", data: webpB64 } }, res);
    expect(res._s).toBe(400);
  });
  it("rechaza no-webp", async () => {
    const res = mockRes();
    await handler({ method:"POST", body:{ slot:"hero", data: Buffer.from("no").toString("base64") } }, res);
    expect(res._s).toBe(400);
  });
  it("acepta webp válido y devuelve path", async () => {
    const res = mockRes();
    await handler({ method:"POST", body:{ slot:"cat-tatuajes", data: webpB64 } }, res);
    expect(res._s).toBe(200);
    expect(res._j.path).toMatch(/^public\/trabajos\/cat-tatuajes-\d+\.webp$/);
  });
});
```

- [ ] **Step 2: Correr → falla.**

Run: `npm test -- api/upload` → FAIL.

- [ ] **Step 3: Crear `api/upload.js`**

Portar de `presskit_digital/api/upload.js` con cambios:
- Sin lista fija de SLOTS: validar `slot` con `/^[a-z0-9-]+$/` y longitud ≤ 40.
- `path = 'public/trabajos/' + slot + '-' + Date.now() + '.webp'`.
- Resto igual (isWebp por RIFF/WEBP, MAX_BYTES 2MB, `ghWrite`, `isAllowedImagePath`).
- El `path` que devuelve al cliente para guardar en content.json debe ser la URL pública: devolver `path` (repo) **y** `url` = `'/trabajos/' + <archivo>` (sin `public/`, que es como Vite sirve public). El cliente guarda `url` en el content.

- [ ] **Step 4: Correr → PASS. Commit**

```bash
git add api/upload.js api/upload.test.js
git commit -m "feat(api): upload de imágenes webp a public/trabajos"
```

---

## Task 10: `vercel.json` (rewrite de /admin) + doc de env

**Files:**
- Create: `vercel.json`, `docs/DEPLOY-ADMIN.md`

**Interfaces:**
- Produces: `/admin` sirve `index.html` (la SPA lo rutea); las funciones `/api/*` no se tocan.

- [ ] **Step 1: Crear `vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/admin", "destination": "/index.html" }
  ]
}
```

Nota: no agregar rewrite catch-all `/(.*)` que tape `/api` o `/trabajos`. Solo `/admin`.

- [ ] **Step 2: Crear `docs/DEPLOY-ADMIN.md`** con el paso a paso:
  1. Crear GitHub token fine-grained: repo `tamara-portfolio`, permiso Contents: Read and write.
  2. `node scripts/hash-password.js <contraseña>` → copiar el hash.
  3. En Vercel → Project → Settings → Environment Variables, agregar: `ADMIN_PASSWORD_HASH`, `GITHUB_TOKEN`, `SESSION_SECRET` (string aleatorio largo). Opcional `GITHUB_OWNER`/`GITHUB_REPO`/`GITHUB_BRANCH` (default `main`) si no se toman de `VERCEL_GIT_*`.
  4. Redeploy.

- [ ] **Step 3: Commit**

```bash
git add vercel.json docs/DEPLOY-ADMIN.md
git commit -m "chore: rewrite /admin + doc de setup del panel"
```

---

## Task 11: Cliente `api.js` del panel

**Files:**
- Create: `src/admin/api.js`, `src/admin/api.test.js`

**Interfaces:**
- Produces (todas usan `fetch` con `credentials:'same-origin'` y devuelven JSON o tiran con el error del server):
  - `getSession() -> {authenticated}`
  - `login(password) -> {ok}` (tira si 401/429)
  - `logout()`
  - `getContent() -> content`
  - `putContent(data) -> {ok}`
  - `uploadImage(slot, dataUrl) -> {url}`

- [ ] **Step 1: Test (mock fetch) `src/admin/api.test.js`**

```js
import { describe, it, expect, vi } from "vitest";
import { login, getContent } from "./api";

describe("admin api", () => {
  it("login tira con el error del server en 401", async () => {
    global.fetch = vi.fn(async () => ({ ok: false, status: 401, json: async () => ({ error: "unauthorized" }) }));
    await expect(login("mala")).rejects.toThrow("unauthorized");
  });
  it("getContent devuelve data", async () => {
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ data: { site: { name: "Z" } } }) }));
    const c = await getContent();
    expect(c.site.name).toBe("Z");
  });
});
```

- [ ] **Step 2: Correr → falla. Implementar `src/admin/api.js`**

```js
async function req(url, options = {}) {
  const res = await fetch(url, { credentials: "same-origin", ...options });
  let body = null;
  try { body = await res.json(); } catch { /* sin cuerpo */ }
  if (!res.ok) throw new Error((body && body.error) || `http_${res.status}`);
  return body;
}

export async function getSession() { return req("/api/session"); }
export async function login(password) {
  return req("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
}
export async function logout() { return req("/api/logout", { method: "POST" }); }
export async function getContent() { const r = await req("/api/content"); return r.data; }
export async function putContent(data) {
  return req("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
}
export async function uploadImage(slot, dataUrl) {
  return req("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slot, data: dataUrl }) });
}
```

- [ ] **Step 3: Correr → PASS. Commit**

```bash
git add src/admin/api.js src/admin/api.test.js
git commit -m "feat(admin): cliente api del panel"
```

---

## Task 12: Ruteo `/admin` + shell + login

**Files:**
- Modify: `src/main.jsx`
- Create: `src/admin/Admin.jsx`, `src/admin/Login.jsx`

**Interfaces:**
- Consumes: `getSession`, `login`, `logout` de `api.js`.
- Produces: en `/admin` monta `<Admin/>`; `Admin` chequea sesión y muestra `<Login/>` o `<Editor/>`.

- [ ] **Step 1: Rutear en `src/main.jsx`**

```jsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Admin from "./admin/Admin";
import { ContentProvider } from "./ContentContext";
import "./index.css";

const isAdmin = window.location.pathname.replace(/\/$/, "") === "/admin";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    {isAdmin ? (
      <Admin />
    ) : (
      <ContentProvider>
        <App />
      </ContentProvider>
    )}
  </StrictMode>,
);
```

- [ ] **Step 2: Crear `src/admin/Login.jsx`**

Pantalla centrada con la estética (fondo `noir`, tarjeta `glass`, título serif `cream`, acento `dusty`). Input password + botón "Entrar". Al submit llama `login(pw)`; en éxito `onSuccess()`; en error muestra el mensaje (credenciales/rate limit). Código completo:

```jsx
import { useState } from "react";
import { login } from "./api";

export default function Login({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try { await login(pw); onSuccess(); }
    catch (err) {
      setError(err.message === "rate_limited" ? "Demasiados intentos. Esperá unos minutos." : "Contraseña incorrecta.");
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-noir px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl glass p-8 shadow-glass">
        <h1 className="font-serif text-3xl text-cream mb-1">Panel</h1>
        <p className="text-mauve text-sm mb-6">Tamara González</p>
        <input
          type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Contraseña" autoFocus
          className="w-full rounded-lg bg-burgundy/60 border border-plum px-4 py-3 text-cream placeholder-mauve focus:outline-none focus:border-dusty"
        />
        {error && <p className="text-rose text-sm mt-3">{error}</p>}
        <button type="submit" disabled={busy}
          className="mt-6 w-full rounded-lg bg-dusty text-noir font-medium py-3 disabled:opacity-60">
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Crear `src/admin/Admin.jsx`**

```jsx
import { useEffect, useState } from "react";
import { getSession } from "./api";
import Login from "./Login";
import Editor from "./Editor";

export default function Admin() {
  const [state, setState] = useState("loading"); // loading | out | in
  useEffect(() => {
    getSession().then((s) => setState(s.authenticated ? "in" : "out")).catch(() => setState("out"));
  }, []);
  if (state === "loading") return <div className="min-h-screen bg-noir grid place-items-center text-mauve">Cargando…</div>;
  if (state === "out") return <Login onSuccess={() => setState("in")} />;
  return <Editor onLogout={() => setState("out")} />;
}
```

- [ ] **Step 4: Editor placeholder temporal** para compilar

Crear `src/admin/Editor.jsx` mínimo (se completa en Task 13):

```jsx
export default function Editor({ onLogout }) {
  return <div className="min-h-screen bg-noir text-cream p-8">Editor (en construcción)</div>;
}
```

- [ ] **Step 5: Build + verificación manual**

Run: `npm run build` → OK. `npm run dev`, abrir `/admin` → aparece el login (con backend no configurado en local, `getSession` puede tirar → cae a login, correcto).

- [ ] **Step 6: Commit**

```bash
git add src/main.jsx src/admin/Admin.jsx src/admin/Login.jsx src/admin/Editor.jsx
git commit -m "feat(admin): ruteo /admin + shell + login"
```

---

## Task 13: Inputs base + estado del editor con dirty tracking

**Files:**
- Create: `src/admin/fields/TextField.jsx`, `src/admin/fields/TextArea.jsx`, `src/admin/fields/Toggle.jsx`
- Rewrite: `src/admin/Editor.jsx`

**Interfaces:**
- Produces:
  - `<TextField label value onChange />`, `<TextArea .../>`, `<Toggle label checked onChange />`.
  - `Editor` carga `getContent()`, guarda en estado local `draft`, `setDraft`, marca `dirty`, botón global "Guardar cambios" → `putContent(draft)`; aviso `beforeunload` si `dirty`.

- [ ] **Step 1: Inputs base** (presentacionales, con tokens de la paleta)

`TextField.jsx`:
```jsx
export default function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-wide text-mauve mb-1">{label}</span>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg bg-burgundy/60 border border-plum px-3 py-2 text-cream placeholder-mauve focus:outline-none focus:border-dusty" />
    </label>
  );
}
```
`TextArea.jsx`: igual con `<textarea rows={4}>`.
`Toggle.jsx`:
```jsx
export default function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer">
      <button type="button" role="switch" aria-checked={!!checked} onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-dusty" : "bg-plum"} relative`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
      <span className="text-cream text-sm">{label}</span>
    </label>
  );
}
```

- [ ] **Step 2: Reescribir `src/admin/Editor.jsx`**

```jsx
import { useEffect, useState, useCallback } from "react";
import { getContent, putContent, logout } from "./api";

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
        {/* Secciones del editor se agregan en tasks 14-18, todas reciben draft + update */}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Build + verificación**

Run: `npm run build` → OK.

- [ ] **Step 4: Commit**

```bash
git add src/admin/fields src/admin/Editor.jsx
git commit -m "feat(admin): inputs base + editor con dirty tracking y guardado global"
```

---

## Task 14: Panel plegable + editores de textos (site, about, keywords)

**Files:**
- Create: `src/admin/Section.jsx` (acordeón), `src/admin/panels/SitePanel.jsx`, `AboutPanel.jsx`, `KeywordsPanel.jsx`
- Modify: `src/admin/Editor.jsx`

**Interfaces:**
- Consumes: `TextField`, `TextArea`, `update`, `draft`.
- Produces: `<Section title>` colapsable; paneles que editan `draft.site.*`, `draft.about.*`, `draft.keywords` (lista de strings).

- [ ] **Step 1: `src/admin/Section.jsx`**

```jsx
import { useState } from "react";
export default function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl border border-plum bg-wine/40 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="font-serif text-xl text-cream">{title}</span>
        <span className="text-mauve">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}
```

- [ ] **Step 2: `SitePanel.jsx`** — edita nombre, rol, esencia, whatsapp, whatsappUrl, ubicación, dominio, y `socials.instagram/behance/pinterest` (todos con `TextField`, `onChange={v => update(['site','name'], v)}` etc.).

- [ ] **Step 3: `AboutPanel.jsx`** — `TextArea` para `about.intro` y `about.body`.

- [ ] **Step 4: `KeywordsPanel.jsx`** — reutiliza `ReorderableList` (Task 16) para strings; por ahora, campos simples add/quitar. (Si Task 16 aún no está, dejar TextFields fijos por índice y completar tras Task 16.)

- [ ] **Step 5: Montar en `Editor.jsx`** dentro del `<main>`:

```jsx
<Section title="Datos generales" defaultOpen><SitePanel draft={draft} update={update} /></Section>
<Section title="Sobre mí"><AboutPanel draft={draft} update={update} /></Section>
<Section title="Palabras clave"><KeywordsPanel draft={draft} update={update} /></Section>
```

- [ ] **Step 6: Build + dev: abrir `/admin` (con sesión simulada saltando el login en dev si hace falta) y verificar que editar cambia el estado. Commit**

```bash
git add src/admin/Section.jsx src/admin/panels src/admin/Editor.jsx
git commit -m "feat(admin): acordeón + edición de textos generales, about y keywords"
```

---

## Task 15: Toggles de secciones

**Files:**
- Create: `src/admin/panels/SectionsPanel.jsx`
- Modify: `src/admin/Editor.jsx`

**Interfaces:**
- Produces: panel con un `Toggle` por cada `draft.sections.*` (portfolio, services, process, about, contact).

- [ ] **Step 1: `SectionsPanel.jsx`**

```jsx
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
```

- [ ] **Step 2: Montar** `<Section title="Secciones visibles"><SectionsPanel draft={draft} update={update} /></Section>` en `Editor.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/admin/panels/SectionsPanel.jsx src/admin/Editor.jsx
git commit -m "feat(admin): toggles de secciones"
```

---

## Task 16: Lista reordenable genérica (servicios, proceso, categorías)

**Files:**
- Create: `src/admin/ReorderableList.jsx`, `src/admin/ReorderableList.test.jsx`
- Create: `src/admin/panels/ServicesPanel.jsx`, `ProcessPanel.jsx`
- Modify: `src/admin/Editor.jsx`

**Interfaces:**
- Produces: `<ReorderableList items renderItem onChange newItem canAddMore />`:
  - Muestra cada item con controles ↑ ↓ 🗑 y un `Toggle` de `enabled`.
  - "Agregar" appendea `newItem()` (con `id` único).
  - `onChange(nextArray)` cada vez que cambia.
  - Helpers puros exportados: `move(arr, from, to)`, `removeAt(arr, i)`.

- [ ] **Step 1: Test de helpers `ReorderableList.test.jsx`**

```jsx
import { describe, it, expect } from "vitest";
import { move, removeAt } from "./ReorderableList";
describe("move/removeAt", () => {
  it("move sube un item", () => { expect(move(["a","b","c"], 2, 1)).toEqual(["a","c","b"]); });
  it("move clampa fuera de rango", () => { expect(move(["a","b"], 0, -1)).toEqual(["a","b"]); });
  it("removeAt saca por índice", () => { expect(removeAt(["a","b","c"], 1)).toEqual(["a","c"]); });
});
```

- [ ] **Step 2: Correr → falla. Implementar `ReorderableList.jsx`**

```jsx
import Toggle from "./fields/Toggle";

export function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
export function removeAt(arr, i) { const n = [...arr]; n.splice(i, 1); return n; }

export default function ReorderableList({ items, renderItem, onChange, newItem, addLabel = "Agregar", canAddMore = true }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="rounded-lg border border-plum bg-burgundy/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-mauve">
              <button type="button" aria-label="Subir" onClick={() => onChange(move(items, i, i - 1))} className="px-2">↑</button>
              <button type="button" aria-label="Bajar" onClick={() => onChange(move(items, i, i + 1))} className="px-2">↓</button>
            </div>
            <div className="flex items-center gap-3">
              <Toggle label="Visible" checked={item.enabled !== false} onChange={(v) => { const n = [...items]; n[i] = { ...item, enabled: v }; onChange(n); }} />
              <button type="button" aria-label="Eliminar" onClick={() => onChange(removeAt(items, i))} className="text-rose px-2">🗑</button>
            </div>
          </div>
          {renderItem(item, (patch) => { const n = [...items]; n[i] = { ...item, ...patch }; onChange(n); })}
        </div>
      ))}
      {canAddMore && (
        <button type="button" onClick={() => onChange([...items, newItem()])}
          className="w-full rounded-lg border border-dashed border-dusty/50 text-dusty py-2 text-sm">+ {addLabel}</button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `ServicesPanel.jsx`** — usa `ReorderableList` sobre `draft.services`; `renderItem(item, patch)` con `TextField` de `title`, `TextArea` de `description`, y un `<select>` de `icon` con opciones fijas (`Sparkle`, `Flower2`, `Hexagon`, `Sparkles`, `Palette`, `PenTool`, `Brush`, `Heart` — todas existen en lucide-react). `newItem = () => ({ id: 'srv-'+Date.now(), title:'', description:'', icon:'Sparkle', enabled:true })`. `onChange = (arr) => update(['services'], arr)`.

- [ ] **Step 4: `ProcessPanel.jsx`** — igual sobre `draft.process`; campos `step`, `title`, `description`. `newItem = () => ({ id:'stp-'+Date.now(), step:'', title:'', description:'', enabled:true })`.

- [ ] **Step 5: Montar** ambos en `Editor.jsx` y actualizar `KeywordsPanel` para usar `ReorderableList` (items = strings mapeados a `{id, value}` o edición directa por índice con add/remove).

- [ ] **Step 6: Correr tests → PASS. Build. Commit**

```bash
git add src/admin/ReorderableList.jsx src/admin/ReorderableList.test.jsx src/admin/panels src/admin/Editor.jsx
git commit -m "feat(admin): lista reordenable + paneles de servicios y proceso"
```

---

## Task 17: Compresión de imagen en el cliente + `ImageField`

**Files:**
- Create: `src/lib/compressImage.js`, `src/lib/compressImage.test.js`, `src/admin/ImageField.jsx`

**Interfaces:**
- Produces:
  - `async compressImage(file, { maxDim=1600, quality=0.82 }) -> dataUrl(webp)` — dibuja en canvas, redimensiona al lado mayor `maxDim`, exporta `image/webp`. Si el resultado > 2 MB, baja calidad iterando.
  - `<ImageField label value slot onChange />` — muestra preview de `value` (URL), botón "Subir", al elegir archivo comprime → `uploadImage(slot, dataUrl)` → `onChange(res.url)`.

- [ ] **Step 1: Test de contrato (con canvas mockeado) `compressImage.test.js`**

```js
import { describe, it, expect, vi } from "vitest";
import { pickQuality } from "./compressImage";

describe("pickQuality", () => {
  it("baja la calidad si el tamaño estimado supera el límite", () => {
    // sizeFor(q): función que simula bytes según calidad
    const sizeFor = (q) => (q > 0.5 ? 3_000_000 : 1_000_000);
    expect(pickQuality(sizeFor, 2_000_000)).toBeLessThanOrEqual(0.5);
  });
  it("mantiene calidad alta si ya entra", () => {
    const sizeFor = () => 500_000;
    expect(pickQuality(sizeFor, 2_000_000)).toBe(0.82);
  });
});
```

- [ ] **Step 2: Correr → falla. Implementar `compressImage.js`**

```js
// pickQuality es puro y testeable; compressImage usa canvas (verificación en browser).
export function pickQuality(sizeFor, maxBytes, start = 0.82, floor = 0.4, step = 0.1) {
  let q = start;
  while (q > floor && sizeFor(q) > maxBytes) q = Math.round((q - step) * 100) / 100;
  return q;
}

export async function compressImage(file, { maxDim = 1600, maxBytes = 2 * 1024 * 1024 } = {}) {
  const img = await loadImage(file);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  const sizeFor = (q) => canvas.toDataURL("image/webp", q).length * 0.75; // aprox bytes desde base64
  const q = pickQuality(sizeFor, maxBytes);
  return canvas.toDataURL("image/webp", q);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}
```

- [ ] **Step 3: `ImageField.jsx`**

```jsx
import { useState } from "react";
import { compressImage } from "../lib/compressImage";
import { uploadImage } from "./api";

export default function ImageField({ label, value, slot, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const dataUrl = await compressImage(file);
      const res = await uploadImage(slot, dataUrl);
      onChange(res.url);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return (
    <div className="mb-4">
      <span className="block text-xs uppercase tracking-wide text-mauve mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg bg-burgundy/60 border border-plum overflow-hidden grid place-items-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-mauve text-xs">sin foto</span>}
        </div>
        <label className="rounded-lg border border-dusty/50 text-dusty px-3 py-2 text-sm cursor-pointer">
          {busy ? "Subiendo…" : "Subir imagen"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="text-rose text-sm">Quitar</button>}
      </div>
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Correr tests → PASS. Build. Commit**

```bash
git add src/lib/compressImage.js src/lib/compressImage.test.js src/admin/ImageField.jsx
git commit -m "feat(admin): compresión webp en cliente + ImageField"
```

---

## Task 18: Imágenes de hero, about y categorías + galerías

**Files:**
- Create: `src/admin/GalleryField.jsx`, `src/admin/panels/HeroPanel.jsx`, `PortfolioPanel.jsx`
- Modify: `src/admin/Editor.jsx`

**Interfaces:**
- Consumes: `ImageField`, `ReorderableList`, `compressImage`, `uploadImage`.
- Produces:
  - `HeroPanel` — `ImageField` para `draft.hero.image` (slot `hero`) + about `ImageField` para `draft.about.image` (slot `about`).
  - `PortfolioPanel` — `ReorderableList` sobre `draft.categories`; cada categoría: `TextField` title/subtitle, `ImageField` cover (slot `cat-<id>`), y `<GalleryField>` para `gallery` (slot `gal-<id>`), con tope soft de 15 (avisa).

- [ ] **Step 1: `GalleryField.jsx`**

```jsx
import { useState } from "react";
import { compressImage } from "../lib/compressImage";
import { uploadImage } from "./api";
import { move, removeAt } from "./ReorderableList";

const SOFT_MAX = 15;

export default function GalleryField({ slot, images, onChange }) {
  const [busy, setBusy] = useState(false);
  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const dataUrl = await compressImage(f);
        const res = await uploadImage(slot, dataUrl);
        uploaded.push(res.url);
      }
      onChange([...(images || []), ...uploaded]);
    } finally { setBusy(false); }
  }
  const list = images || [];
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-mauve">Galería ({list.length})</span>
        {list.length >= SOFT_MAX && <span className="text-rose text-xs">Muchas fotos: conviene no pasar de {SOFT_MAX}.</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {list.map((url, i) => (
          <div key={url} className="relative group aspect-square rounded-md overflow-hidden border border-plum">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-between p-1 bg-gradient-to-t from-noir/80 to-transparent opacity-0 group-hover:opacity-100 transition">
              <button type="button" aria-label="Antes" onClick={() => onChange(move(list, i, i - 1))} className="text-cream text-xs">←</button>
              <button type="button" aria-label="Quitar" onClick={() => onChange(removeAt(list, i))} className="text-rose text-xs">✕</button>
              <button type="button" aria-label="Después" onClick={() => onChange(move(list, i, i + 1))} className="text-cream text-xs">→</button>
            </div>
          </div>
        ))}
      </div>
      <label className="mt-2 inline-block rounded-lg border border-dusty/50 text-dusty px-3 py-2 text-sm cursor-pointer">
        {busy ? "Subiendo…" : "+ Agregar fotos"}
        <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={busy} />
      </label>
    </div>
  );
}
```

- [ ] **Step 2: `HeroPanel.jsx`** con dos `ImageField` (hero, about).

- [ ] **Step 3: `PortfolioPanel.jsx`** con `ReorderableList` sobre categorías. `newItem = () => ({ id:'cat-'+Date.now(), title:'', subtitle:'', enabled:true, cover:'', gallery:[] })`. Cada item usa slots `cat-<id>` (cover) y `gal-<id>` (galería) — sanear `id` a `[a-z0-9-]`.

- [ ] **Step 4: Montar** `HeroPanel` y `PortfolioPanel` en `Editor.jsx`.

- [ ] **Step 5: Build. Commit**

```bash
git add src/admin/GalleryField.jsx src/admin/panels src/admin/Editor.jsx
git commit -m "feat(admin): imágenes de hero/about/categorías + galerías"
```

---

## Task 19: Lightbox de galería en el sitio público

**Files:**
- Create: `src/components/Lightbox.jsx`, `src/components/Lightbox.test.jsx`
- Modify: `src/components/PortfolioSection.jsx`

**Interfaces:**
- Produces: `<Lightbox images index onClose onIndexChange />` — overlay accesible (role=dialog, Esc cierra, flechas navegan, focus trap), estética glass/dusty. Reusa `useFocusTrap` si existe; si no, implementa el trap mínimo inline.
- `PortfolioSection`: si la categoría tiene `gallery.length`, la tarjeta abre el lightbox; si no, mantiene el link a Instagram.

- [ ] **Step 1: Test de Lightbox `Lightbox.test.jsx`**

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Lightbox from "./Lightbox";

describe("Lightbox", () => {
  it("muestra la imagen actual y cierra con Esc", () => {
    const onClose = vi.fn();
    render(<Lightbox images={["/a.webp","/b.webp"]} index={0} onClose={onClose} onIndexChange={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Correr → falla. Implementar `Lightbox.jsx`**

```jsx
import { useEffect } from "react";

export default function Lightbox({ images, index, onClose, onIndexChange }) {
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);
  const next = () => onIndexChange((index + 1) % images.length);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [index, images.length]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Galería" onClick={onClose}
      className="fixed inset-0 z-[100] bg-noir/95 backdrop-blur grid place-items-center p-6">
      <button aria-label="Cerrar" onClick={onClose} className="absolute top-4 right-4 text-cream text-2xl">✕</button>
      {images.length > 1 && (
        <>
          <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-cream text-3xl">‹</button>
          <button aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-cream text-3xl">›</button>
        </>
      )}
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-glass-lg" />
    </div>
  );
}
```

- [ ] **Step 3: Cablear en `PortfolioSection.jsx`**

`WorkCard`: si `item.gallery?.length`, renderizar `<button onClick={() => openGallery(item)}>` en vez de `<a href=instagram>`. `PortfolioSection` maneja estado `{cat, index}` y monta `<Lightbox images={cat.gallery} .../>` cuando hay categoría abierta. Cover de la tarjeta: usar `item.cover || item.gallery?.[0] || ""`.

- [ ] **Step 4: Correr tests → PASS. Build + verificación visual del lightbox. Commit**

```bash
git add src/components/Lightbox.jsx src/components/Lightbox.test.jsx src/components/PortfolioSection.jsx
git commit -m "feat: lightbox de galería con fallback a Instagram"
```

---

## Task 20: Verificación end-to-end y cierre

**Files:** ninguno nuevo (verificación + posibles fixes).

- [ ] **Step 1: Suite completa**

Run: `npm test` → todo PASS. `npm run build` → sin errores. `npm run lint` → sin errores nuevos.

- [ ] **Step 2: Verificación manual del sitio público**

`npm run dev`: el sitio se ve idéntico al actual (content.json = defaults). Apagar una sección en `public/content.json` a mano y confirmar que desaparece. Cargar una `gallery` a mano y confirmar el lightbox.

- [ ] **Step 3: Verificación del panel (requiere env local o deploy de preview)**

Con `ADMIN_PASSWORD_HASH`/`GITHUB_TOKEN`/`SESSION_SECRET` seteadas (o en un preview de Vercel): entrar a `/admin`, loguear, editar un texto, subir una imagen, reordenar una lista, guardar, y confirmar que el commit aparece en el repo y el cambio se ve en el sitio.

- [ ] **Step 4: Commit final de docs si hubo ajustes**

```bash
git add -A && git commit -m "chore: verificación end-to-end del panel" || echo "sin cambios"
```

---

## Notas de ejecución

- **Publicación:** `content.json` y las imágenes son estáticos (`public/`); cada guardado commitea y Vercel redeploya solo (~30-60s hasta verse). No es instantáneo — es automático. Si en el futuro se quiere instantaneidad, haría falta un endpoint público de lectura en vivo (no incluido).
- Tras Task 5 el sitio ya es data-driven y desplegable sin regresiones (buen punto de checkpoint).
- Tras Task 10 el backend está completo y testeado; el panel (11-19) es puro frontend contra esa API.
- El panel no se puede probar del todo en local sin las env vars; usar un preview de Vercel o setearlas en un `.env` que Vercel dev levante (`vercel dev`).
- Mantener cada commit chico y verde (tests + build).
