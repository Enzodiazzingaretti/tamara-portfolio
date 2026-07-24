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
