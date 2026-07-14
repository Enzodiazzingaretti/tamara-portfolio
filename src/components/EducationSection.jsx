import { motion } from "framer-motion";
import { Award, BookOpen } from "lucide-react";
import { EDUCATION, TOOLS } from "../content";
import { fadeUp, stagger } from "../utils/animations";
import SectionHeading from "./SectionHeading";

function TimelineItem({ item }) {
  const isCert = item.type === "certification";

  return (
    <motion.div variants={fadeUp} className="relative pl-10 pb-12 group">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-white/5 group-last:hidden" />

      {/* Dot */}
      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] border border-gold/30 bg-ink flex items-center justify-center">
        {isCert ? (
          <Award size={8} className="text-gold/60" />
        ) : (
          <BookOpen size={8} className="text-warmGray/40" />
        )}
      </div>

      <span className="text-[10px] font-sans uppercase tracking-editorial text-gold/50 mb-1 block">
        {item.year}
      </span>
      <h4 className="font-serif text-lg font-light text-ivory mb-1">
        {item.title}
      </h4>
      <p className="text-xs text-warmGray/60">{item.institution}</p>
    </motion.div>
  );
}

export default function EducationSection() {
  return (
    <section id="education" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="gold-divider-wide mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading label="Formación" title="Aprendizaje continuo" />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {EDUCATION.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </motion.div>

          {/* Tools */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
            }}
          >
            <motion.span
              variants={fadeUp}
              className="text-[11px] font-sans uppercase tracking-editorial text-gold mb-6 block"
            >
              Herramientas
            </motion.span>

            <div className="grid grid-cols-2 gap-3">
              {TOOLS.map((tool) => (
                <motion.div
                  key={tool}
                  variants={fadeUp}
                  className="px-5 py-4 border border-white/5 text-sm text-warmGray/70 hover:border-gold/20 hover:text-ivory transition-all duration-500"
                >
                  {tool}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
