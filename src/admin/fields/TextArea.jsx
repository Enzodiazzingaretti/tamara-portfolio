export default function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-wide text-mauve mb-1">{label}</span>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full rounded-lg bg-burgundy/60 border border-plum px-3 py-2 text-cream placeholder-mauve focus:outline-none focus:border-dusty resize-y" />
    </label>
  );
}
