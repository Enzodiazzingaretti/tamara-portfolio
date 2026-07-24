import { motion } from "framer-motion";
import { useContent } from "../ContentContext";
import { fadeUp, slideFromLeft, slideFromRight } from "../utils/animations";
import Monogram from "./Monogram";

export default function AboutSection() {
  const { about, site } = useContent();
  return (
    <section id="about" className="section-padding section-band relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-sm font-sans uppercase tracking-editorial text-cream mb-14"
        >
          Sobre mí
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Quote */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={slideFromLeft}
          >
            <div className="flex gap-5">
              <span className="font-serif text-7xl text-dusty/50 leading-[0.7] select-none">
                &ldquo;
              </span>
              <p className="font-serif text-display-md font-light text-cream leading-snug">
                {site.essence}
              </p>
            </div>
          </motion.div>

          {/* Identity + bio */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={slideFromRight} className="flex items-center gap-4 mb-8">
              <Monogram size={60} />
              <div>
                <p className="text-sm uppercase tracking-editorial text-cream">
                  {site.name}
                </p>
                <p className="text-[11px] uppercase tracking-editorial text-mauve mt-1">
                  {site.role}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rose-divider mb-8" />

            <motion.p variants={fadeUp} className="text-sm text-mauve leading-loose mb-5">
              {about.intro}
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm text-mauve/90 leading-loose">
              {about.body}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
