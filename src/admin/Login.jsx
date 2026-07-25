import { useState } from "react";
import { Lock, LogIn, Loader2, AlertCircle } from "lucide-react";
import { login } from "./api";
import Monogram from "../components/Monogram";

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
    <div className="relative min-h-screen grid place-items-center bg-noir px-6 overflow-hidden">
      {/* glow decorativo */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] rounded-full bg-dusty/10 blur-[120px]" />

      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl glass p-8 shadow-glass-lg text-center">
        <div className="flex justify-center mb-5">
          <Monogram size={52} />
        </div>
        <h1 className="font-serif text-3xl text-cream">Panel</h1>
        <p className="text-[11px] uppercase tracking-[0.18em] text-mauve mt-1 mb-7">Tamara González</p>

        <div className="relative text-left">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve/60" strokeWidth={1.5} />
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)}
            placeholder="Contraseña" autoFocus aria-label="Contraseña"
            className="w-full rounded-xl bg-burgundy/40 border border-plum/70 pl-11 pr-4 py-3 text-cream placeholder-mauve/50 outline-none transition-colors focus:border-dusty/80 focus:ring-2 focus:ring-dusty/20"
          />
        </div>

        {error && (
          <p className="flex items-center justify-center gap-1.5 text-rose text-sm mt-3">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        <button
          type="submit" disabled={busy}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-dusty text-noir font-medium py-3 transition-colors hover:bg-rose disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} strokeWidth={1.75} />}
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
