# Tamara González — Portfolio

Portfolio profesional de Tamara González (Marketing Digital & Community Management),
diseñado por **Rabbit Studio**. Construido con React, Vite y Tailwind CSS.

## Setup

1. Instalar Node.js (LTS recomendado).
2. Instalar dependencias:
   - `npm install`
3. Levantar el sitio en desarrollo:
   - `npm run dev`

## Stack

- React 19 + Vite 6
- Tailwind CSS
- framer-motion (animaciones)
- lucide-react (íconos)

## Contenido del sitio

Todo el contenido editable vive en `src/content.js`:

- `SITE` — nombre, rol, email y redes.
- `ABOUT` — bio.
- `SPECIALTIES` — servicios/especialidades.
- `PROJECTS` — proyectos muestra (problema → solución → resultado).
- `EDUCATION` / `TOOLS` — formación y herramientas.

## Deploy

Configurado para Netlify (`netlify.toml`): build `npm run build`, publica `dist/`.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — previsualizar el build.
- `npm run lint` — ESLint.
