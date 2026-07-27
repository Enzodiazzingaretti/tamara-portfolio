import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { fadeUp } from "../utils/animations";
import { useContent } from "../ContentContext";
import Monogram from "./Monogram";
import RabbitStudioLogo from "./RabbitStudioLogo";

export default function Footer() {
  const { site } = useContent();
  const links = [
    { label: "Instagram", href: site.socials.instagram },
    { label: "Behance", href: site.socials.behance },
    { label: "Pinterest", href: site.socials.pinterest },
  ].filter((s) => s.href);
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
            <p className="text-[11px] text-mauve tracking-wide leading-relaxed">
              © {year} {site.name}.<br className="hidden sm:block" /> Todos los derechos reservados.
              {" "}
              <a
                href="/admin"
                aria-label="Panel de administración"
                title="Panel"
                className="inline-flex items-center align-middle ml-1 text-mauve/35 hover:text-dusty transition-colors duration-500"
              >
                <Flower2 size={13} strokeWidth={1.5} />
              </a>
            </p>
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {links.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-editorial text-mauve hover:text-dusty transition-colors duration-500 px-2 py-3"
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
              <p className="text-[10px] uppercase tracking-editorial text-mauve/90">
                Estudio creativo
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
