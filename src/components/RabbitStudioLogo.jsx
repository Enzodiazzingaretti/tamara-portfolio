/* Minimal Rabbit Studio mark — a soft line-drawn rabbit silhouette. */
export default function RabbitStudioLogo({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Ears */}
      <path d="M9 11c-.8-2.2-1.1-4.6-.7-6.8.1-.6.9-.8 1.3-.3 1.3 1.7 2 3.8 2.1 6" />
      <path d="M15 11c.8-2.2 1.1-4.6.7-6.8-.1-.6-.9-.8-1.3-.3-1.3 1.7-2 3.8-2.1 6" />
      {/* Head / body */}
      <path d="M7.5 12.5C7.5 10.6 9.5 10 12 10s4.5.6 4.5 2.5c0 1.4-.7 2.4-1.6 3.2.5.5.8 1.2.8 2 0 .7-.6 1.3-1.3 1.3H9.6c-.7 0-1.3-.6-1.3-1.3 0-.8.3-1.5.8-2-.9-.8-1.6-1.8-1.6-3.2Z" />
      {/* Eye */}
      <circle cx="10.5" cy="13.2" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
