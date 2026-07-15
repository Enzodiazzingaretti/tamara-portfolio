import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { SITE } from "../content";
import Monogram from "./Monogram";
import RabbitStudioLogo from "./RabbitStudioLogo";

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
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Identity */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 text-center md:text-left">
            <Monogram size={44} />
            <p className="text-[11px] text-mauve/80 tracking-wide leading-relaxed">
              © {year} {SITE.name}.<br className="hidden sm:block" /> Todos los derechos reservados.
            </p>
          </motion.div>

          {/* Socials */}
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

          {/* Rabbit Studio */}
          <motion.div
            variants={fadeUp}
            className="group flex items-center gap-3 text-mauve"
          >
            <RabbitStudioLogo
              size={34}
              className="text-dusty group-hover:text-rose transition-colors duration-500"
            />
            <div className="text-center md:text-left leading-tight">
              <p className="font-serif text-base italic tracking-wide text-cream group-hover:text-dusty transition-colors duration-500">
                Rabbit Studio
              </p>
              <p className="text-[9px] uppercase tracking-editorial text-mauve/70">
                Estudio creativo
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
