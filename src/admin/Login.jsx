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
