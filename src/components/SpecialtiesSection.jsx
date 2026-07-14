import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { SPECIALTIES } from "../content";
import { fadeUp, stagger } from "../utils/animations";
import SectionHeading from "./SectionHeading";

function SpecialtyCard({ specialty, index }) {
  const Icon = Icons[specialty.icon] || Icons.Sparkles;

  return (
    <motion.div
      variants={fadeUp}
      className="group relative p-8 lg:p-10 border border-white/5 hover:border-gold/20 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.02]"
    >
      {/* Index number */}
      <span className="absolute top-4 right-4 text-[10px] font-sans text-warmGray/30 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="mb-6">
        <Icon
          size={20}
          strokeWidth={1}
          className="text-gold/60 group-hover:text-gold transition-colors duration-500"
        />
      </div>

      <h3 className="font-serif text-xl font-light text-ivory mb-4 group-hover:text-gold transition-colors duration-500">
        {specialty.title}
      </h3>

      <p className="text-sm text-warmGray/70 leading-relaxed">
        {specialty.description}
      </p>
    </motion.div>
  );
}

export default function SpecialtiesSection() {
  return (
    <section id="specialties" className="section-padding relative">
      {/* Subtle separator */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="gold-divider-wide mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          label="Especialidades"
          title="Lo que hago"
          align="center"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5"
        >
          {SPECIALTIES.map((specialty, i) => (
            <SpecialtyCard key={specialty.title} specialty={specialty} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
