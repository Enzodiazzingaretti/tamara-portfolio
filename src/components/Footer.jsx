import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { SITE } from "../content";
import Monogram from "./Monogram";

const SOCIALS = [
  { label: "Instagram", href: SITE.instagram },
  { label: "Behance", href: SITE.behance },
  { label: "Pinterest", href: SITE.pinterest },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-6 lg:px-12 pb-10 pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="hairline mb-8" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 text-center md:text-left">
            <Monogram size={44} />
            <p className="text-[11px] text-mauve/80 tracking-wide leading-relaxed">
              © {year} {SITE.name}.<br className="hidden sm:block" /> Todos los derechos reservados.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-7">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-editorial text-mauve hover:text-dusty transition-colors duration-500"
              >
                {s.label}
              </a>
            ))}
          </motion.div>

          <motion.a
            variants={fadeUp}
            href={`https://${SITE.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-editorial text-cream/70 hover:text-dusty transition-colors duration-500"
          >
            {SITE.domain}
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
}
