import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";

export default function SectionHeading({ label, title, align = "left" }) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className={`flex flex-col ${alignment} mb-20`}
    >
      {label && (
        <motion.span
          variants={fadeUp}
          className="text-[11px] font-sans uppercase tracking-editorial text-gold mb-4"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-serif text-display-lg font-light text-ivory"
      >
        {title}
      </motion.h2>
      <motion.div variants={fadeUp} className="gold-divider mt-6" />
    </motion.div>
  );
}
