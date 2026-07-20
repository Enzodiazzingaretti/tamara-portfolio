import { motion } from "framer-motion";
import { Sparkle, Flower2, Hexagon, Sparkles } from "lucide-react";
import { SERVICES } from "../content";
import { fadeUp } from "../utils/animations";

const ICONS = { Sparkle, Flower2, Hexagon, Sparkles };

function ServiceCard({ service, index }) {
  const Icon = ICONS[service.icon] || Sparkle;
  return (
    <motion.div variants={fadeUp} className="group relative">
      <div className="flex items-center gap-4 mb-5">
        <Icon
          size={26}
          strokeWidth={1}
          className="text-roseGold group-hover:text-dusty transition-colors duration-500"
        />
        <span className="font-serif text-lg text-mauve/70 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-serif text-xl font-light text-cream mb-3 leading-snug">
        {service.title}
      </h3>
      <p className="text-sm text-mauve leading-relaxed">{service.description}</p>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="servicios" className="section-padding section-band relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="text-sm font-sans uppercase tracking-editorial text-cream"
          >
            Servicios
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[11px] uppercase tracking-editorial text-mauve"
          >
            Soluciones a medida para marcas ambiciosas.
          </motion.p>
        </motion.div>

        <div className="hairline mb-14" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
