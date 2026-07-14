import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PROJECTS } from "../content";
import { fadeUp, scaleIn } from "../utils/animations";
import SectionHeading from "./SectionHeading";

/* Social-feed style mockup. Shows real images when provided in content.js,
   otherwise an elegant placeholder grid ready to be swapped. */
function FeedMockup({ project, index }) {
  const tiles = Array.from({ length: 9 });

  return (
    <div className="aspect-[4/5] rounded-[1.75rem] glass p-4 overflow-hidden">
      {/* Faux profile row */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-mauve/70 flex items-center justify-center text-cream font-serif text-sm italic">
          {project.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="h-2 w-24 rounded-full bg-mauve/25" />
          <div className="h-1.5 w-16 rounded-full bg-mauve/15 mt-1.5" />
        </div>
      </div>

      {/* 3x3 grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {tiles.map((_, i) => {
          const img = project.images?.[i];
          return (
            <div
              key={i}
              className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-petal/60 to-dusty/40 flex items-center justify-center"
            >
              {img ? (
                <img
                  src={img}
                  alt={`${project.name} — pieza ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-mauve/25 text-xs italic select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        index > 0 ? "mt-28 lg:mt-36" : ""
      }`}
    >
      {/* Mockup */}
      <motion.div
        variants={scaleIn}
        className={`relative ${isEven ? "" : "lg:order-2"}`}
      >
        <FeedMockup project={project} index={index} />
        {/* Accent corner */}
        <div
          className={`absolute -bottom-3 ${
            isEven ? "-left-3" : "-right-3"
          } w-16 h-16 rounded-lg border-b border-dusty/40 ${
            isEven ? "border-l" : "border-r"
          }`}
        />
      </motion.div>

      {/* Content */}
      <div className={isEven ? "" : "lg:order-1"}>
        <div className="flex items-center gap-3 mb-3">
          <motion.span
            variants={fadeUp}
            className="text-[10px] font-sans uppercase tracking-editorial text-mauve"
          >
            {project.category}
          </motion.span>
          {project.concept && (
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-sans uppercase tracking-wide text-mauve glass-soft"
            >
              <Sparkles size={9} strokeWidth={1.5} />
              Proyecto conceptual
            </motion.span>
          )}
        </div>

        <motion.h3
          variants={fadeUp}
          className="font-serif text-display-md font-light text-plum mb-6"
        >
          {project.name}
        </motion.h3>

        <motion.div variants={fadeUp} className="rose-divider mb-8" />

        <div className="space-y-6">
          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-mauve/70 mb-2">
              Problema
            </h4>
            <p className="text-sm text-plumSoft leading-relaxed">
              {project.problem}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-mauve/70 mb-2">
              Solución
            </h4>
            <p className="text-sm text-plumSoft leading-relaxed">
              {project.solution}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-[11px] font-sans uppercase tracking-editorial text-mauve/70 mb-2">
              Enfoque & objetivo
            </h4>
            <p className="text-sm text-plum leading-relaxed">
              {project.result}
            </p>
          </motion.div>
        </div>

        {/* Highlight metrics */}
        {project.highlights?.length > 0 && (
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
            {project.highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-xl glass px-4 py-3 min-w-[120px]"
              >
                <div className="font-serif text-2xl text-mauve leading-none">
                  {h.value}
                </div>
                <div className="text-[10px] text-plumSoft/80 mt-1.5 leading-tight">
                  {h.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wide px-3 py-1 rounded-full border border-mauve/20 text-plumSoft"
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
        <div className="rose-divider-wide mx-auto" />
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
