import { motion } from "framer-motion";
import { Sparkle, MessageCircle, ArrowRight } from "lucide-react";
import { useContent } from "../ContentContext";
import { fadeUp, blurIn, slideFromRight } from "../utils/animations";

// Chips del hero: navegan a la sección correspondiente
const HERO_LINKS = [
  { label: "Tatuajes", href: "#trabajos" },
  { label: "Ilustración", href: "#trabajos" },
  { label: "Pintura", href: "#trabajos" },
  { label: "Marketing & Branding", href: "#servicios" },
];

export default function HeroSection() {
  const { site, hero } = useContent();
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
              <p className="font-serif text-2xl italic text-cream">{site.name}</p>
              <p className="text-[11px] uppercase tracking-editorial text-mauve mt-1">
                {site.role}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#trabajos"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full glass text-cream text-xs uppercase tracking-editorial hover:text-dusty hover:shadow-glass-lg transition-all duration-500"
              >
                Ver trabajos
                <ArrowRight
                  size={14}
                  strokeWidth={1.25}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full border border-roseGold/30 text-mauve text-xs uppercase tracking-editorial hover:border-dusty/60 hover:text-dusty transition-all duration-500"
              >
                <MessageCircle size={14} strokeWidth={1.25} />
                Hablemos
              </a>
            </motion.div>

            {/* Category links */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              {HERO_LINKS.map((k) => (
                <a
                  key={k.label}
                  href={k.href}
                  className="text-[10px] uppercase tracking-wide px-3.5 py-1.5 rounded-full glass-soft text-cream/70 hover:text-dusty hover:[border-color:rgba(207,163,171,0.35)] transition-all duration-500"
                >
                  {k.label}
                </a>
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
              {hero?.image ? (
                <div className="absolute inset-0 rounded-[2rem] glass overflow-hidden">
                  <img
                    src={hero.image}
                    alt={site.name}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 rounded-[2rem] glass art-placeholder overflow-hidden flex flex-col items-center justify-center gap-4">
                  <span className="font-serif text-[7rem] leading-none text-dusty/20 italic select-none">
                    T
                  </span>
                  <span className="text-[10px] uppercase tracking-editorial text-mauve/60">
                    Foto mía
                  </span>
                </div>
              )}
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
