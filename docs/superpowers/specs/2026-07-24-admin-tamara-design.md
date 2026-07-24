# Panel de administración para el portfolio de Tamara

**Fecha:** 2026-07-24
**Estado:** aprobado (diseño) — pendiente de plan de implementación
**Proyecto:** `tamara-portfolio` (React 19 + Vite + Tailwind + Framer Motion)

## Objetivo

Dar a Tamara un panel tipo admin —equivalente al del press kit de Kexxy— para
editar **todos los textos, imágenes y secciones** del sitio sin tocar código,
manteniendo la estética actual (dark burgundy + dusty rose, glassmorphism, serif).

Alcance de edición acordado: **control total (CRUD)** — editar contenido,
prender/apagar secciones, y agregar/quitar/reordenar items (servicios, pasos,
categorías) incluyendo **galerías de varias fotos por categoría**.

## Enfoque elegido

**Runtime `content.json` + GitHub como backend** (patrón del press kit portado a
React, **igual a como funciona hoy el press kit**). Descartado: DB/CMS headless
(sobredimensionado, agrega costo y dependencias).

- `src/content.js` deja de ser la fuente de verdad y pasa a ser **defaults
  embebidos** + un loader.
- La app hace `fetch('/content.json', {cache:'no-store'})` al cargar y mergea
  sobre los defaults. Si el fetch falla, usa los defaults (el sitio nunca queda
  en blanco).
- El panel lee/escribe `content.json` y sube imágenes vía funciones serverless
  de Vercel que escriben en el propio repo por la GitHub Contents API.

**Publicación de los cambios (importante, sin sobrevender):** `content.json` y
las imágenes se sirven como archivos estáticos desde `public/`. Guardar en el
panel commitea al repo, y **Vercel redeploya solo** al recibir el commit; el
cambio queda publicado en **~30-60s**, sin intervención manual. Es exactamente
el comportamiento del press kit (que también fetchea un `content.json`
estático). No es instantáneo, pero es automático. El `fetch` con `no-store`
garantiza que, una vez redeployado, el navegador tome la versión nueva sin
quedar pegado a cache. Un endpoint de lectura en vivo (para instantaneidad real)
se descartó: agrega una invocación serverless por visita y se aleja del patrón
del press kit; con el repo privado, `raw.githubusercontent` tampoco es opción.

## Componentes

### 1. Backend serverless (`/api`, portado del press kit)

Archivos, adaptados de `presskit_digital/api/`:

- `api/_lib.js` — helpers compartidos:
  - Auth: verificación de contraseña con **scrypt** (`ADMIN_PASSWORD_HASH`),
    sesión firmada con **HMAC-SHA256** (`SESSION_SECRET`), cookie `HttpOnly`
    `Secure` `SameSite=Strict`, 12 h.
  - GitHub: `ghRead`/`ghWrite` contra la Contents API. El `sha` se resuelve
    del lado del servidor (el browser nunca lo maneja).
  - Owner/repo/branch desde `VERCEL_GIT_*` con override por env. **Nunca**
    hardcodear un repo por defecto.
  - `ALLOWED_FILES = ['content.json']`; validación de rutas de imagen.
- `api/login.js`, `api/logout.js`, `api/session.js` — ciclo de sesión.
- `api/content.js` — `GET` (lee `content.json`) y `PUT` (lo reescribe, con
  mensaje de commit).
- `api/upload.js` — `POST` de una imagen webp (≤2 MB), la escribe en el repo con
  nombre fresco (`<slot>-<timestamp>.webp`) para que CDN/browser la tomen ya.

Cambios respecto del press kit:
- `COOKIE_NAME` y `User-Agent` renombrados a Tamara.
- `BRANCH` por defecto `main` (el press kit usa `master`).
- Rutas de imagen bajo `public/trabajos/` (ver más abajo), no `img/`.

### 2. Modelo de contenido (`content.json`)

Migración de los consts actuales a un único JSON versionado. Forma:

```json
{
  "site": {
    "name": "Tamara González",
    "role": "Artista Visual",
    "essence": "El arte como refugio, memoria y transformación.",
    "whatsapp": "+54 …",
    "whatsappUrl": "https://wa.me/…",
    "location": "…",
    "domain": "tamaragonzalez.com",
    "socials": { "instagram": "…", "behance": "…", "pinterest": "…" }
  },
  "sections": {
    "portfolio": true, "services": true, "process": true,
    "about": true, "contact": true
  },
  "hero": { "image": "" },
  "about": { "intro": "…", "body": "…", "image": "" },
  "categories": [
    {
      "id": "tatuajes", "title": "Tatuajes", "subtitle": "Ilustración",
      "enabled": true, "cover": "", "gallery": ["/trabajos/…webp"]
    }
  ],
  "services":  [ { "id": "...", "title": "…", "description": "…", "icon": "Sparkle", "enabled": true } ],
  "process":   [ { "id": "...", "step": "01", "title": "…", "description": "…", "enabled": true } ],
  "keywords": ["Tatuajes", "Ilustración", "Pintura", "Marketing & Branding"]
}
```

Notas del modelo:
- El **orden** de cada lista es el orden del array (reordenar = mover en el
  array). No hace falta un campo `order`.
- `enabled` por item permite ocultar sin borrar. `sections.*` oculta secciones
  enteras.
- Los `icon` de servicios se eligen de un set fijo de iconos de `lucide-react`
  (dropdown en el panel), no texto libre, para no romper el build.
- `content.js` exporta `DEFAULTS` (el JSON actual como fallback) y
  `loadContent()` que hace el fetch + merge.

### 3. Consumo en la app (React)

- Un `ContentProvider` (context) en `main.jsx`/`App.jsx` que llama a
  `loadContent()` una vez, guarda el resultado en estado y lo expone por hook
  `useContent()`.
- Los componentes de sección (`HeroSection`, `PortfolioSection`,
  `ServicesSection`, `ProcessSection`, `AboutSection`, `ContactSection`,
  `Footer`, `WhatsAppFloat`, `Navbar`) dejan de importar de `content.js` y pasan
  a leer de `useContent()`.
- `App.jsx` renderiza cada sección **solo si** `sections.<x>` está en `true`.
- Estado de carga: los defaults se muestran de entrada (no hay pantalla en
  blanco); cuando llega el fetch, se re-renderiza con el contenido real.

### 4. Galerías (portfolio)

- Cada categoría con `gallery.length > 0` abre un **lightbox** con sus fotos
  (en vez de linkear a Instagram). Si una categoría no tiene galería, cae al
  comportamiento actual (link a Instagram) para no dejar tarjetas muertas.
- El lightbox es un componente nuevo, con la estética del sitio (glass, dusty
  rose), navegable con teclado (flechas + Esc) y con focus trap — mismo estándar
  de accesibilidad que ya tiene el proyecto.

### 5. Panel de admin (`/admin`)

- **Ruteo sin router:** `main.jsx` detecta `location.pathname === '/admin'` y
  monta `<Admin/>` en vez de `<App/>`. `vercel.json` agrega un rewrite para que
  `/admin` sirva el `index.html` (SPA).
- **Login:** una pantalla con la estética del sitio; POST a `api/login`.
- **Editor:** acordeón por secciones. Cada sección:
  - Textos: inputs/textareas inline.
  - Toggle de sección on/off.
  - Listas (servicios, pasos, categorías): agregar, quitar, reordenar (flechas
    ↑/↓), y editar cada item. Toggle `enabled` por item.
  - Imágenes: subir desde el panel. En el cliente se **recorta/redimensiona y
    convierte a webp** (canvas) y se comprime por debajo del límite antes de
    mandar a `api/upload`. Al volver el `path`, se guarda en el `content.json`.
- **Guardar:** un único botón global "Guardar cambios" que manda todo el
  `content.json` con un `PUT api/content` (guardado atómico). Feedback claro de
  éxito/error, y aviso de cambios sin guardar al salir. Sin autosave. (Las
  imágenes se suben en el momento vía `api/upload`; el botón global solo
  persiste el `content.json`.)
- Mismo lenguaje visual que el sitio; se percibe como parte de Tamara, no un
  dashboard genérico.

## Almacenamiento de imágenes

- **En el repo**, como el press kit. Se suben a `public/trabajos/` como webp.
- Compresión y conversión a webp en el cliente antes de subir; límite duro de
  2 MB por archivo en el servidor.
- **Tope sugerido:** ~15 fotos por galería y ~40 en total, para no inflar el
  repo ni los deploys. El panel avisa al acercarse al tope (soft limit, no
  bloqueante).
- Nombres con timestamp para invalidar cache de CDN/browser al reemplazar.

## Fuera de alcance (YAGNI)

- **Multi-idioma.** El sitio es solo español. Se puede agregar después sin
  rehacer esto.
- **Autosave / historial de versiones.** El historial ya lo da git (cada
  guardado es un commit).
- **Storage externo** (Vercel Blob, Cloudinary). Se evaluará solo si el volumen
  de fotos supera lo que el repo tolera cómodamente.

## Requisitos operativos (una vez, los hace Enzo)

1. Crear un **GitHub token** (fine-grained, con permiso de contenidos sobre el
   repo `tamara-portfolio`).
2. Generar el hash de la contraseña con un script (`scripts/hash-password.js`,
   portado).
3. Cargar en Vercel las variables de entorno: `ADMIN_PASSWORD_HASH`,
   `GITHUB_TOKEN`, `SESSION_SECRET` (y opcionalmente `GITHUB_OWNER`/`GITHUB_REPO`
   /`GITHUB_BRANCH` si no se toman de `VERCEL_GIT_*`).

Se entrega un paso a paso.

## Seguridad

- El token de GitHub vive solo del lado del servidor (env de Vercel), nunca en
  el cliente.
- La API solo permite escribir `content.json` y rutas de imagen validadas
  (`public/trabajos/<slot>-<digits>.webp`) — sin traversal ni extensiones
  arbitrarias.
- Comparación de contraseña en tiempo constante; cookie de sesión firmada,
  `HttpOnly`/`Secure`/`SameSite=Strict`, 12 h.
- Rate limiting de login: se evalúa en el plan (el press kit no lo tenía; es una
  mejora barata que conviene incluir).

## Criterios de éxito

- Tamara edita cualquier texto, imagen o item, prende/apaga secciones y arma
  galerías, todo desde `/admin`, sin tocar código.
- Al guardar, el cambio se publica solo (Vercel redeploya con el commit) y queda
  visible en el sitio público en ~30-60s.
- El sitio público se ve y se comporta **idéntico** al actual cuando el
  `content.json` iguala los defaults (ninguna regresión visual).
- Sin el `content.json` (o con la API caída), el sitio sigue mostrando los
  defaults embebidos.
