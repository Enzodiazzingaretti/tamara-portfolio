const { requireAuth, ghWrite, isAllowedImagePath } = require('./_lib.js');

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
// No fixed slot list: hero, about, cat-<id> (cover), gal-<id> (gallery), etc.
// A plain slug is enough — the final path is what isAllowedImagePath guards.
const SLOT_RE = /^[a-z0-9-]+$/;

// Validate by magic bytes, not by trusting the client: RIFF at 0, WEBP at 8.
function isWebp(buf) {
  return buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP';
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const body = req.body || {};
    const slot = body.slot;
    const data = body.data;

    if (typeof slot !== 'string' || slot.length > 40 || !SLOT_RE.test(slot)) {
      return res.status(400).json({ error: 'bad_slot' });
    }
    if (typeof data !== 'string' || !data) {
      return res.status(400).json({ error: 'bad_data' });
    }

    const buf = Buffer.from(data, 'base64');
    if (buf.length > MAX_BYTES) {
      return res.status(400).json({ error: 'too_large' });
    }
    if (!isWebp(buf)) {
      return res.status(400).json({ error: 'not_webp' });
    }

    const filename = slot + '-' + Date.now() + '.webp';
    const path = 'public/trabajos/' + filename;
    // Defense in depth: the slug regex should make this always true.
    if (!isAllowedImagePath(path)) {
      return res.status(400).json({ error: 'bad_path' });
    }

    await ghWrite(path, buf.toString('base64'), 'upload: ' + filename + ' desde el panel');
    // path = ubicación en el repo; url = ruta pública (Vite sirve public/ en la raíz).
    return res.status(200).json({ ok: true, path, url: '/trabajos/' + filename });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
