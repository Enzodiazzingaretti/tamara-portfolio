export default function TextField({ label, value, onChange, placeholder, hint }) {
  return (
    <label className="block mb-5">
      <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-mauve mb-1.5">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-burgundy/40 border border-plum/70 px-4 py-2.5 text-cream placeholder-mauve/50 outline-none transition-colors focus:border-dusty/80 focus:ring-2 focus:ring-dusty/20"
      />
      {hint && <span className="block text-[11px] text-mauve/70 mt-1.5">{hint}</span>}
    </label>
  );
}
