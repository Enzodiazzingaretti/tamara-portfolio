# Setup del panel de administración (`/admin`)

El panel deja a Tamara editar textos, imágenes y secciones sin tocar código.
Guarda los cambios escribiendo `content.json` (y las imágenes en `public/trabajos/`)
en el repo vía la API de GitHub; Vercel redeploya solo (~30–60 s) y el sitio toma
el contenido nuevo. Nada es instantáneo: se publica con cada redeploy.

Este documento es el paso a paso para dejarlo funcionando. Son pasos manuales
(tienen secretos), no automatizables desde acá.

## 1. Token de GitHub (fine-grained)

1. GitHub → Settings → Developer settings → **Fine-grained tokens** → *Generate new token*.
2. **Repository access:** Only select repositories → `tamara-portfolio`.
3. **Permissions → Repository permissions → Contents: Read and write.**
4. Generá y **copiá el token** (empieza con `github_pat_...`). Solo se muestra una vez.

## 2. Generar el hash de la contraseña y el secreto de sesión

En la raíz del repo:

```bash
node scripts/hash-password.cjs
```

Es **interactivo**: pide la contraseña por pantalla (mínimo 10 caracteres, no se
guarda en ningún archivo ni sale de tu máquina) e imprime, listos para pegar:

- `ADMIN_PASSWORD_HASH` — el hash `scrypt$<salt>$<key>`.
- `SESSION_SECRET` — un secreto aleatorio ya generado.

(El `GITHUB_TOKEN` es el del paso 1; el script solo te lo recuerda.)

## 3. Variables de entorno en Vercel

Vercel → proyecto **tamara-portfolio** → Settings → **Environment Variables**.
Agregá para *Production* (y *Preview* si querés probar en ramas):

| Variable | Valor |
|----------|-------|
| `ADMIN_PASSWORD_HASH` | el hash del paso 2 |
| `SESSION_SECRET` | el secreto del paso 2 |
| `GITHUB_TOKEN` | el token del paso 1 |

Opcionales (solo si Vercel no las provee solo): `GITHUB_OWNER`, `GITHUB_REPO`,
`GITHUB_BRANCH`. Por defecto se toman de `VERCEL_GIT_REPO_OWNER` /
`VERCEL_GIT_REPO_SLUG` / `VERCEL_GIT_COMMIT_REF`, y la rama cae a `main`. **No**
hay repo hardcodeado a propósito: si faltan y Vercel no las expone, la API
responde `501 not_configured` en vez de escribir en el repo equivocado.

## 4. Redeploy

Vercel → Deployments → *Redeploy* del último (o pusheá cualquier cambio). Las env
vars solo toman efecto en un deploy nuevo.

## 5. Verificar

1. Entrá a `https://<tu-deploy>.vercel.app/admin` → debería pedir la contraseña.
2. Logueá con la del paso 2. Si sale `not_configured`, falta alguna env var; si
   sale `unauthorized`, la contraseña no coincide con el hash.
3. Editá algo, guardá, esperá el redeploy (~30–60 s) y verificá en el sitio público.

## Notas

- El repo es **privado**, así que el sitio lee su `content.json` del propio build
  (no de `raw.githubusercontent`).
- Endpoints: `POST /api/login`, `POST /api/logout`, `GET /api/session`,
  `GET|PUT /api/content`, `POST /api/upload`. Todo bajo sesión con cookie
  `HttpOnly; Secure; SameSite=Strict` de 12 h. Login con rate limit (5/10 min por IP).
- Las imágenes suben como **webp** (≤ 2 MB) a `public/trabajos/<slot>-<timestamp>.webp`.
