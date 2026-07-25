async function req(url, options = {}) {
  const res = await fetch(url, { credentials: "same-origin", ...options });
  let body = null;
  try { body = await res.json(); } catch { /* sin cuerpo */ }
  if (!res.ok) throw new Error((body && body.error) || `http_${res.status}`);
  return body;
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export async function getSession() { return req("/api/session"); }
export async function login(password) { return req("/api/login", json("POST", { password })); }
export async function logout() { return req("/api/logout", { method: "POST" }); }
export async function getContent() { const r = await req("/api/content"); return r.data; }
export async function putContent(data) { return req("/api/content", json("PUT", { data })); }
export async function uploadImage(slot, dataUrl) { return req("/api/upload", json("POST", { slot, data: dataUrl })); }
