// Interruptor accesible con estética dusty. Pista deslizante suave.
export default function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer select-none group">
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-dusty/40 ${
          checked ? "bg-dusty" : "bg-plum"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream shadow-sm transition-transform duration-300 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      {label && <span className="text-sm text-cream/90 group-hover:text-cream transition-colors">{label}</span>}
    </label>
  );
}
