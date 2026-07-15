import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { SITE, KEYWORDS } from "../content";
import { fadeUp, blurIn, slideFromRight } from "../utils/animations";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-10 items-center min-h-screen py-32">
          {/* Left: Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
            }}
            className="flex flex-col justify-center"
          >
            <motion.p
              variants={fadeUp}
              className="flex items-center gap-3 text-[11px] font-sans uppercase tracking-editorial text-mauve mb-8"
            >
              <Sparkle size={12} className="text-dusty" />
              Portfolio · Artista Visual
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="font-serif text-display-xl font-light text-cream leading-[0.98] mb-8"
            >
              El arte como
              <br />
              <span className="text-dusty italic">refugio</span>, memoria
              <br />y <span className="text-dusty italic">transformación</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base text-mauve leading-relaxed max-w-md mb-10"
            >
              Tatuajes, ilustración y pintura con intención. Creo piezas y marcas
              que conectan, emocionan y perduran.
            </motion.p>

            {/* Signature */}
            <motion.div variants={fadeUp} className="mb-10">
              <p className="font-serif text-2xl italic text-cream">{SITE.name}</p>
              <p className="text-[11px] uppercase tracking-editorial text-mauve mt-1">
                {SITE.role}
              </p>
            </motion.div>

            {/* Category chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              {KEYWORDS.map((k) => (
                <span
                  key={k}
                  className="text-[10px] uppercase tracking-wide px-3.5 py-1.5 rounded-full glass-soft text-cream/70"
                >
                  {k}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Portrait */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideFromRight}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4]">
              <div className="absolute inset-0 rounded-[2rem] glass art-placeholder overflow-hidden flex flex-col items-center justify-center gap-4">
                <span className="font-serif text-[7rem] leading-none text-dusty/20 italic select-none">
                  T
                </span>
                <span className="text-[10px] uppercase tracking-editorial text-mauve/60">
                  Foto mía
                </span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-br-[2rem] border-r border-b border-dusty/30" />
            </div>

            {/* Vertical side labels */}
            <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full flex-col items-center gap-6 text-[9px] uppercase tracking-editorial text-mauve/50 [writing-mode:vertical-rl]">
              <span>Tatuaje</span>
              <Sparkle size={10} className="text-dusty/50 rotate-90" />
              <span>Ilustración</span>
              <Sparkle size={10} className="text-dusty/50 rotate-90" />
              <span>Pintura</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
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
