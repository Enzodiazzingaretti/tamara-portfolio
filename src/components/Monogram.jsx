/* TG monogram inside a thin rose-gold ring. */
export default function Monogram({ size = 56, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-roseGold/40 text-cream ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="font-serif italic leading-none"
        style={{ fontSize: size * 0.42 }}
      >
        <span>T</span>
        <span className="text-dusty">G</span>
      </span>
    </span>
  );
}
