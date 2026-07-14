import { motion } from "framer-motion";
import {
  Share2,
  CalendarDays,
  TrendingUp,
  PenTool,
  Palette,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { SPECIALTIES } from "../content";
import { fadeUp, stagger } from "../utils/animations";
import SectionHeading from "./SectionHeading";

// Only the icons referenced by content.js — keeps lucide-react out of the bundle wholesale.
const ICONS = {
  Share2,
  CalendarDays,
  TrendingUp,
  PenTool,
  Palette,
  BarChart3,
  Sparkles,
};

function SpecialtyCard({ specialty, index }) {
  const Icon = ICONS[specialty.icon] || Sparkles;

  return (
    <motion.div
      variants={fadeUp}
      className="group relative p-8 lg:p-10 rounded-2xl glass hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-500"
    >
      {/* Index number */}
      <span className="absolute top-4 right-4 text-[10px] font-sans text-mauve/40 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="mb-6">
        <Icon
          size={20}
          strokeWidth={1.25}
          className="text-mauve group-hover:text-dusty transition-colors duration-500"
        />
      </div>

      <h3 className="font-serif text-xl font-light text-plum mb-4 group-hover:text-mauve transition-colors duration-500">
        {specialty.title}
      </h3>

      <p className="text-sm text-plumSoft leading-relaxed">
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
        <div className="rose-divider-wide mx-auto" />
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SPECIALTIES.map((specialty, i) => (
            <SpecialtyCard key={specialty.title} specialty={specialty} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
