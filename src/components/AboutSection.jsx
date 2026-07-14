import { motion } from "framer-motion";
import { ABOUT } from "../content";
import { fadeUp, slideFromLeft, slideFromRight } from "../utils/animations";
import SectionHeading from "./SectionHeading";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading label="Sobre mí" title="Creatividad con propósito" />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={slideFromLeft}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] glass overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-9xl text-mauve/15 italic select-none">
                  TG
                </span>
              </div>
            </div>
            {/* Accent corner */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-br-[2rem] border-r border-b border-dusty/40" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.p
              variants={fadeUp}
              className="font-serif text-display-md font-light text-plum mb-8 leading-snug"
            >
              {ABOUT.intro}
            </motion.p>

            <motion.div variants={fadeUp} className="rose-divider mb-8" />

            <motion.p
              variants={fadeUp}
              className="text-sm text-plumSoft leading-loose"
            >
              {ABOUT.body}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
