# Tamara González — Portfolio

Perfil de **artista visual** de Tamara González — tatuajes, ilustración y pintura,
más servicios de Marketing & Branding. Estética dark romantic (burgundy + dusty rose).
Construido con React, Vite y Tailwind CSS.

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

- `SITE` — nombre, rol, frase de esencia, WhatsApp, ubicación y redes.
- `ABOUT` — bio.
- `CATEGORIES` — trabajos seleccionados (Tatuajes, Pinturas, Dibujos, Foto mía); poné el cover en `image`.
- `SERVICES` — servicios (Marketing & Branding, Ilustración, Pintura, C.M.).
- `PROCESS` — pasos del proceso.
- `KEYWORDS` — palabras clave.

## Deploy

Vercel. Detecta Vite automáticamente: build `npm run build`, output `dist/`. Cada
push a `main` deploya solo.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — previsualizar el build.
- `npm run lint` — ESLint.
