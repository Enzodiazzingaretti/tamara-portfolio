import { motion } from "framer-motion";
import { SITE } from "../content";
import { fadeUp, blurIn, slideFromRight } from "../utils/animations";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Soft rose glow accents */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--rose) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--dusty) 0%, transparent 70%)",
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
              className="text-xs font-sans uppercase tracking-editorial text-mauve mb-6"
            >
              Hola, soy
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="font-serif text-display-xl font-light text-plum mb-4"
            >
              Tamara
              <br />
              <span className="text-dusty italic">González</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="rose-divider mb-8" />

            <motion.p
              variants={fadeUp}
              className="text-sm uppercase tracking-editorial text-mauve mb-8"
            >
              {SITE.role}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-plumSoft leading-relaxed max-w-md mb-12"
            >
              Transformo ideas en estrategias digitales con propósito,
              construyendo presencias de marca que conectan y generan resultados.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full glass text-mauve text-xs uppercase tracking-editorial hover:shadow-glass-lg transition-all duration-500"
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
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-mauve/25 text-plumSoft text-xs uppercase tracking-editorial hover:border-mauve/50 hover:text-plum transition-all duration-500"
              >
                Descargar CV
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Photo placeholder (glass) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideFromRight}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[3/4]">
              <div className="absolute inset-0 rounded-[2rem] glass overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-[10rem] text-mauve/20 italic select-none">
                    T
                  </span>
                </div>
              </div>
              {/* Soft accent corner */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-br-[2rem] border-r border-b border-dusty/40" />
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
        <span className="text-[10px] uppercase tracking-editorial text-mauve/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-dusty/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
