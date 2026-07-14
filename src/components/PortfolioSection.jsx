import { motion } from "framer-motion";
import { PROJECTS } from "../content";
import { fadeUp, stagger, scaleIn } from "../utils/animations";
import SectionHeading from "./SectionHeading";

function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        index > 0 ? "mt-32 lg:mt-40" : ""
      }`}
    >
      {/* Mockup */}
      <motion.div
        variants={scaleIn}
        className={`relative ${isEven ? "" : "lg:order-2"}`}
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-[#16140f] to-[#0d0c0a] border border-white/5 overflow-hidden group">
          {/* Placeholder mockup */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="font-serif text-6xl text-gold/8 italic select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.03] transition-colors duration-700" />
        </div>
        {/* Gold accent */}
        <div
          className={`absolute -bottom-3 ${
            isEven ? "-left-3" : "-right-3"
          } w-16 h-16 border-b border-gold/15 ${
            isEven ? "border-l" : "border-r"
          }`}
        />
      </motion.div>

      {/* Content */}
      <div className={isEven ? "" : "lg:order-1"}>
        <motion.span
          variants={fadeUp}
          className="text-[10px] font-sans uppercase tracking-editorial text-gold/70 mb-3 block"
        >
          {project.category}
        </motion.span>

        <motion.h3
          variants={fadeUp}
          className="font-serif text-display-md font-light text-ivory mb-8"
        >
          {project.name}
        </motion.h3>

        <motion.div variants={fadeUp} className="gold-divider mb-8" />

        <div className="space-y-6">
          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-warmGray/50 mb-2">
              Problema
            </h4>
            <p className="text-sm text-warmGray leading-relaxed">
              {project.problem}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-warmGray/50 mb-2">
              Solución
            </h4>
            <p className="text-sm text-warmGray leading-relaxed">
              {project.solution}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-warmGray/50 mb-2">
              Resultado
            </h4>
            <p className="text-sm text-ivory/80 leading-relaxed">
              {project.result}
            </p>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wide px-3 py-1 border border-white/8 text-warmGray/50"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="gold-divider-wide mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          label="Portfolio"
          title="Proyectos seleccionados"
          align="center"
        />

        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
