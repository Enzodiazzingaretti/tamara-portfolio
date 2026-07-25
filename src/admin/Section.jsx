import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Section({ title, subtitle, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-plum/60 bg-wine/40 overflow-hidden transition-colors hover:border-plum">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
      >
        {Icon && (
          <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-burgundy/60 border border-plum/60 text-dusty">
            <Icon size={17} strokeWidth={1.5} />
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block font-serif text-xl text-cream leading-tight">{title}</span>
          {subtitle && <span className="block text-[12px] text-mauve/80 mt-0.5">{subtitle}</span>}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={`shrink-0 text-mauve group-hover:text-dusty transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="px-5 pb-5 pt-1 border-t border-plum/40"
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}
