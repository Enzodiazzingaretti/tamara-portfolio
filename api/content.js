const { requireAuth, ghRead, ghWrite, isAllowedFile } = require('./_lib.js');

// Vite sirve /content.json desde public/, así que se lee y escribe ahí.
const FILE = 'public/content.json';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAuth(req, res)) return;
  if (!isAllowedFile(FILE)) return res.status(400).json({ error: 'bad_file' });

  try {
    if (req.method === 'GET') {
      const found = await ghRead(FILE);
      if (!found) return res.status(404).json({ error: 'not_found' });

      const text = Buffer.from(found.content, 'base64').toString('utf8');
      return res.status(200).json({ data: JSON.parse(text) });
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      if (body.data == null || typeof body.data !== 'object') {
        return res.status(400).json({ error: 'bad_payload' });
      }

      const json = JSON.stringify(body.data, null, 2) + '\n';
      const message = 'update: contenido desde el panel';

      await ghWrite(FILE, Buffer.from(json, 'utf8').toString('base64'), message);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
