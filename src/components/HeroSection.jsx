import { motion } from "framer-motion";
import { SITE } from "../content";
import { fadeUp, blurIn, slideFromLeft, slideFromRight } from "../utils/animations";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-[#0f0d0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />

      {/* Subtle gold ambient light */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-screen py-32">
          {/* Left: Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
            }}
            className="flex flex-col justify-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-sans uppercase tracking-editorial text-warmGray mb-6"
            >
              Hola, soy
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="font-serif text-display-xl font-light text-ivory mb-4"
            >
              Tamara
              <br />
              <span className="text-gold italic">González</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="gold-divider mb-8" />

            <motion.p
              variants={fadeUp}
              className="text-sm uppercase tracking-editorial text-warmGray mb-8"
            >
              {SITE.role}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-warmGray/80 leading-relaxed max-w-md mb-12"
            >
              Transformo ideas en estrategias digitales con propósito,
              construyendo presencias de marca que conectan y generan resultados.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-gold/40 text-gold text-xs uppercase tracking-editorial hover:bg-gold/10 transition-all duration-500"
              >
                Ver Portfolio
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
              <a
                href={SITE.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-ivory/70 text-xs uppercase tracking-editorial hover:border-white/25 hover:text-ivory transition-all duration-500"
              >
                Descargar CV
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Photo placeholder */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideFromRight}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[3/4]">
              {/* Photo container with integrated shadows */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1815] to-[#0d0c0a] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-8xl text-gold/10 italic select-none">
                    T
                  </span>
                </div>
              </div>
              {/* Edge blending */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ink/60" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-ink to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-editorial text-warmGray/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
