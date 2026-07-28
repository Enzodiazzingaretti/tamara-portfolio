import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../ContentContext";
import { fadeUp, scaleIn } from "../utils/animations";
import { isVideo } from "../utils/media";
import CategoryGallery from "./CategoryGallery";

function CardInner({ item, index }) {
  const firstProject = item.projects?.find((p) => p.enabled !== false);
  const cover = item.cover || firstProject?.cover || firstProject?.media?.[0] || item.gallery?.[0] || "";
  const coverClass =
    "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105";
  return (
    <div className="relative aspect-[3/4] art-placeholder overflow-hidden">
      {cover && (
        isVideo(cover) ? (
          <video
            src={cover}
            className={coverClass}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={cover} alt={item.title} loading="lazy" className={coverClass} />
        )
      )}
      {/* index */}
      <span className="absolute top-4 left-4 font-serif text-lg text-cream/70 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full border border-cream/20 text-cream/70 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
        <ArrowUpRight size={14} strokeWidth={1.25} />
      </span>

      {/* gradient + label */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-serif text-2xl font-light text-cream group-hover:text-dusty transition-colors duration-500">
          {item.title}
        </h3>
        <p className="text-[10px] uppercase tracking-editorial text-mauve mt-1">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
}

function WorkCard({ item, index, instagram, onOpen }) {
  const cardClass =
    "group relative block w-full text-left rounded-2xl overflow-hidden glass hover:[border-color:rgba(207,163,171,0.3)] hover:shadow-glass-lg transition-all duration-500";

  if (item.projects?.some((p) => p.enabled !== false) || item.gallery?.length) {
    return (
      <motion.button type="button" variants={scaleIn} onClick={onOpen} className={cardClass}>
        <CardInner item={item} index={index} />
      </motion.button>
    );
  }
  return (
    <motion.a href={instagram} target="_blank" rel="noopener noreferrer" variants={scaleIn} className={cardClass}>
      <CardInner item={item} index={index} />
    </motion.a>
  );
}

export default function PortfolioSection() {
  const { categories, site } = useContent();
  const [openCat, setOpenCat] = useState(null); // categoría abierta | null

  return (
    <section id="trabajos" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex items-end justify-between gap-6 mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="text-sm font-sans uppercase tracking-editorial text-cream"
          >
            Trabajos seleccionados
          </motion.h2>
          <motion.a
            variants={fadeUp}
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-mauve hover:text-dusty transition-colors duration-500 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Ver todos los proyectos</span>
            <span className="sm:hidden">Ver todos</span>
            <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full border border-roseGold/40 group-hover:border-dusty/60 transition-colors">
              <ArrowUpRight size={13} strokeWidth={1.25} />
            </span>
          </motion.a>
        </motion.div>

        <div className="hairline mb-12" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {categories.filter((c) => c.enabled).map((item, i) => (
            <WorkCard
              key={item.id}
              item={item}
              index={i}
              instagram={site.socials.instagram}
              onOpen={() => setOpenCat(item)}
            />
          ))}
        </motion.div>
      </div>

      {openCat && (
        <CategoryGallery category={openCat} onClose={() => setOpenCat(null)} />
      )}
    </section>
  );
}
