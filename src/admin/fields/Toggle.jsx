export default function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer">
      <button type="button" role="switch" aria-checked={!!checked} onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-dusty" : "bg-plum"} relative`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
      <span className="text-cream text-sm">{label}</span>
    </label>
  );
}
