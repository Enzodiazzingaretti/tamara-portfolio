import { motion } from "framer-motion";
import { PROCESS } from "../content";
import { fadeUp } from "../utils/animations";

export default function ProcessSection() {
  return (
    <section id="proceso" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14"
        >
          <motion.h2
            variants={fadeUp}
            className="text-sm font-sans uppercase tracking-editorial text-cream"
          >
            Mi proceso
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[11px] uppercase tracking-editorial text-mauve"
          >
            Un enfoque pensado desde la idea hasta la ejecución.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
        >
          {PROCESS.map((item, i) => (
            <motion.div key={item.step} variants={fadeUp} className="relative">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-serif text-5xl font-light text-dusty/80 leading-none">
                  {item.step}
                </span>
                <h3 className="text-[11px] font-sans uppercase tracking-editorial text-cream">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-mauve leading-relaxed">
                {item.description}
              </p>
              {/* connector arrow (desktop) */}
              {i < PROCESS.length - 1 && (
                <span className="hidden lg:block absolute top-4 -right-3 text-dusty/40">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
