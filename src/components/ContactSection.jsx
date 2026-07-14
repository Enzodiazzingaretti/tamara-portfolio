import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, Download } from "lucide-react";
import { SITE } from "../content";
import { fadeUp, stagger } from "../utils/animations";

const LINKS = [
  { icon: Mail, label: "Email", href: `mailto:${SITE.email}`, text: SITE.email },
  { icon: Linkedin, label: "LinkedIn", href: SITE.linkedin, text: "LinkedIn" },
  { icon: Instagram, label: "Instagram", href: SITE.instagram, text: "Instagram" },
  { icon: Download, label: "CV", href: SITE.cvUrl, text: "Descargar CV" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="gold-divider-wide mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.span
            variants={fadeUp}
            className="text-[11px] font-sans uppercase tracking-editorial text-gold mb-4 block"
          >
            Contacto
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-display-lg font-light text-ivory mb-6"
          >
            Trabajemos juntos
          </motion.h2>

          <motion.div variants={fadeUp} className="gold-divider mx-auto mb-12" />

          <motion.p
            variants={fadeUp}
            className="text-sm text-warmGray leading-relaxed max-w-lg mx-auto mb-16"
          >
            Si estás buscando a alguien que aporte visión estratégica, creatividad
            y compromiso a tu proyecto digital, me encantaría conversar.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {LINKS.map(({ icon: Icon, label, href, text }) => (
            <motion.a
              key={label}
              variants={fadeUp}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3 p-8 border border-white/5 hover:border-gold/25 transition-all duration-500"
            >
              <Icon
                size={18}
                strokeWidth={1}
                className="text-warmGray/40 group-hover:text-gold transition-colors duration-500"
              />
              <span className="text-xs uppercase tracking-editorial text-ivory/70 group-hover:text-gold transition-colors duration-500">
                {text}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
