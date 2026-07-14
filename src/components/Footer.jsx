import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* RA logo */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3"
          >
            <span className="font-serif text-lg text-gold/40 italic tracking-wide">
              RA
            </span>
            <span className="text-[10px] uppercase tracking-editorial text-warmGray/30">
              Rabbit Studio
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[11px] text-warmGray/30 tracking-wide"
          >
            © {year} Tamara González. Todos los derechos reservados.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[10px] text-warmGray/20 tracking-wide"
          >
            Diseño por Rabbit Studio
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
