# Tamara González — Portfolio

**Portfolio site for a tattoo and visual artist**, with a project-based gallery and an admin panel she updates herself. Dark romantic palette (burgundy + dusty rose).

🔗 **[tamara-portfolio-xi.vercel.app](https://tamara-portfolio-xi.vercel.app)**

---

## What it does

- **Project-based galleries** across tattoos, painting and drawing — a project opens into its own modal with the full set of pieces, image and video
- **Lightbox** with keyboard navigation
- **Admin panel** at `/admin` in two modes: *simple* for adding work, *advanced* for restructuring the site
- **Services and process sections** for the Marketing & Branding side of her practice
- **WhatsApp inquiry** as the primary contact path — it's how her clients actually reach her

## Engineering notes

### Tested where it matters

Component tests with **Vitest + Testing Library** cover the parts users touch most and that break silently: `Navbar`, `Lightbox`, `CategoryGallery`.

```bash
npm test
```

### An image pipeline, not an upload form

A tattoo portfolio is photographs, and photographs are the whole payload. `npm run imagenes` runs a local pipeline built on **`sharp`** and **`ffmpeg-static`** that generates thumbnails and derivative sizes ahead of deploy, so the browser never downloads a 4 MB original to show a 300px grid tile. `SmartImage` handles loading priority — above-the-fold covers eager, everything else lazy.

### Git-backed content

Content lives in `public/content.json` and the admin panel commits it back to the repository through the GitHub API; Vercel redeploys automatically. No database, and every content edit is a commit with a full history.

---

## Stack

| | |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Icons** | lucide-react |
| **Testing** | Vitest + Testing Library + jsdom |
| **Media** | sharp, ffmpeg-static |
| **Deploy** | Vercel |

## Running locally

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm test` | Component tests |
| `npm run lint` | ESLint |
| `npm run imagenes` | Generate thumbnails and derivative sizes |

## Editing content

Everything editable lives in `src/content.js`:

| Key | Contents |
|---|---|
| `SITE` | Name, role, tagline, WhatsApp, location, social links |
| `ABOUT` | Bio |
| `CATEGORIES` | Selected work — tattoos, paintings, drawings |
| `SERVICES` | Marketing & branding, illustration, painting, community management |
| `PROCESS` | Process steps |
| `KEYWORDS` | SEO keywords |

Or use `/admin` and never open the file.

---

<details>
<summary><b>🇦🇷 Español</b></summary>

<br>

**Sitio de portfolio para una artista visual y tatuadora**, con galería por proyectos y un panel de administración que actualiza ella misma. Paleta dark romantic (burgundy + dusty rose).

## Qué hace

- **Galerías por proyecto** entre tatuajes, pintura y dibujo — cada proyecto abre en su propio modal con la serie completa, imagen y video
- **Lightbox** con navegación por teclado
- **Panel de administración** en `/admin` con dos modos: *simple* para cargar obra, *avanzado* para reestructurar el sitio
- **Secciones de servicios y proceso** para la parte de Marketing & Branding de su trabajo
- **Consulta por WhatsApp** como vía principal de contacto — es por donde realmente la contactan

## Notas de ingeniería

### Testeado donde importa

Tests de componentes con **Vitest + Testing Library** sobre las partes que el usuario más toca y que se rompen en silencio: `Navbar`, `Lightbox`, `CategoryGallery`.

```bash
npm test
```

### Un pipeline de imágenes, no un formulario de subida

Un portfolio de tatuajes son fotos, y las fotos son todo el peso. `npm run imagenes` corre un pipeline local sobre **`sharp`** y **`ffmpeg-static`** que genera miniaturas y tamaños derivados antes del deploy, así el navegador nunca baja un original de 4 MB para mostrar una celda de 300px. `SmartImage` maneja la prioridad de carga: las portadas above-the-fold en eager, el resto lazy.

### Contenido sobre git

El contenido vive en `public/content.json` y el panel lo commitea de vuelta al repositorio por la API de GitHub; Vercel redeploya solo. Sin base de datos, y cada edición de contenido queda como un commit con historial completo.

## Correr en local

```bash
npm install
npm run dev
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar el build |
| `npm test` | Tests de componentes |
| `npm run lint` | ESLint |
| `npm run imagenes` | Generar miniaturas y tamaños derivados |

## Editar contenido

Todo lo editable vive en `src/content.js`:

| Clave | Contenido |
|---|---|
| `SITE` | Nombre, rol, frase de esencia, WhatsApp, ubicación y redes |
| `ABOUT` | Bio |
| `CATEGORIES` | Trabajos seleccionados — tatuajes, pinturas, dibujos |
| `SERVICES` | Marketing & branding, ilustración, pintura, community management |
| `PROCESS` | Pasos del proceso |
| `KEYWORDS` | Palabras clave para SEO |

O usar `/admin` y no abrir nunca el archivo.

</details>
