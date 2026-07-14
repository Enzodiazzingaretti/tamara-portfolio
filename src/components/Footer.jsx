import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import RabbitStudioLogo from "./RabbitStudioLogo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-10 px-6 lg:px-12 pb-8">
      <div className="max-w-7xl mx-auto glass rounded-3xl py-10 px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Rabbit Studio brand */}
          <motion.a
            href="#"
            variants={fadeUp}
            className="flex items-center gap-2.5 text-mauve hover:text-dusty transition-colors duration-500"
          >
            <RabbitStudioLogo size={22} />
            <span className="font-serif text-lg italic tracking-wide">
              Rabbit Studio
            </span>
          </motion.a>

          <motion.p
            variants={fadeUp}
            className="text-[11px] text-plumSoft/70 tracking-wide text-center"
          >
            © {year} Tamara González. Todos los derechos reservados.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[10px] uppercase tracking-editorial text-plumSoft/50"
          >
            Diseño por Rabbit Studio
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
