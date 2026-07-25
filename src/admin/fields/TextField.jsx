export default function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-wide text-mauve mb-1">{label}</span>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg bg-burgundy/60 border border-plum px-3 py-2 text-cream placeholder-mauve focus:outline-none focus:border-dusty" />
    </label>
  );
}
