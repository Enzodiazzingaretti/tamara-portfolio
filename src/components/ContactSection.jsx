import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, MapPin, Sparkle } from "lucide-react";
import { SITE, KEYWORDS } from "../content";
import { fadeUp, stagger } from "../utils/animations";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* CTA banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl glass p-8 sm:p-14 mb-8"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-display-md font-light text-cream leading-tight mb-5">
                ¿Tienes un proyecto
                <br />
                en mente?
              </h2>
              <p className="text-sm text-mauve mb-9 max-w-sm">
                Creemos algo con intención y propósito.
              </p>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full glass-strong text-cream text-xs uppercase tracking-editorial hover:text-dusty transition-all duration-500"
              >
                <MessageCircle size={15} strokeWidth={1.25} />
                Hablemos
                <ArrowRight
                  size={14}
                  strokeWidth={1.25}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
            </div>

            {/* Decorative */}
            <div className="relative hidden lg:flex justify-end">
              <div className="relative w-full max-w-sm aspect-[16/10] rounded-2xl art-placeholder overflow-hidden flex items-center justify-center">
                <Sparkle size={40} strokeWidth={0.6} className="absolute left-10 text-dusty/40" />
                <p className="font-serif italic text-2xl text-cream/70">
                  Las ideas toman forma.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact band */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Palabras clave */}
          <motion.div variants={fadeUp} className="rounded-2xl glass p-8">
            <p className="text-[11px] uppercase tracking-editorial text-mauve mb-5">
              Palabras clave
            </p>
            <ul className="space-y-2.5">
              {KEYWORDS.map((k) => (
                <li key={k} className="flex items-center gap-3 text-sm text-cream/85">
                  <span className="w-1 h-1 rounded-full bg-dusty" />
                  {k}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={fadeUp} className="rounded-2xl glass p-8">
            <p className="text-[11px] uppercase tracking-editorial text-mauve mb-5">
              Contacto
            </p>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 mb-4"
            >
              <span className="grid place-items-center w-8 h-8 rounded-full border border-roseGold/40 text-dusty shrink-0 group-hover:border-dusty/60 transition-colors">
                <MessageCircle size={14} strokeWidth={1.25} />
              </span>
              <span>
                <span className="block text-sm text-cream/85 group-hover:text-dusty transition-colors">
                  Contacto a WhatsApp
                </span>
                <span className="block text-sm text-mauve">{SITE.whatsapp}</span>
              </span>
            </a>
            <p className="flex items-center gap-3 text-sm text-mauve">
              <MapPin size={14} strokeWidth={1.25} className="text-roseGold" />
              {SITE.location}
            </p>
          </motion.div>

          {/* Sígueme */}
          <motion.div variants={fadeUp} className="rounded-2xl glass p-8 flex flex-col">
            <p className="text-[11px] uppercase tracking-editorial text-mauve mb-5">
              Sígueme
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 hover:text-dusty transition-colors uppercase tracking-wide"
              >
                Instagram
              </a>
              <a
                href={SITE.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 hover:text-dusty transition-colors uppercase tracking-wide"
              >
                Behance
              </a>
              <a
                href={SITE.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/85 hover:text-dusty transition-colors uppercase tracking-wide"
              >
                Pinterest
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
