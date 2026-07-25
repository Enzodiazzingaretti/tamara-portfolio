import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";
import { useContent } from "../ContentContext";

const NAV_LINKS = [
  { label: "Trabajos", href: "#trabajos", section: "portfolio" },
  { label: "Servicios", href: "#servicios", section: "services" },
  { label: "Proceso", href: "#proceso", section: "process" },
  { label: "Sobre mí", href: "#about", section: "about" },
  { label: "Contacto", href: "#contact", section: "contact" },
];

export default function Navbar() {
  const { site, sections } = useContent();
  // Ocultar del menú los links de secciones apagadas desde el panel.
  const links = NAV_LINKS.filter((l) => !l.section || sections?.[l.section] !== false);
  const showPortfolio = sections?.portfolio !== false;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "glass-strong border-b border-roseGold/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <a
            href="#"
            className="font-serif text-lg tracking-editorial uppercase text-cream hover:text-dusty transition-colors duration-500 whitespace-nowrap"
          >
            Tamara González
          </a>

          {/* Desktop (lg+: en tablet los links no entran sin quebrarse) */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[11px] font-sans uppercase tracking-editorial text-mauve hover:text-dusty transition-colors duration-500 whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {showPortfolio && (
              <a
                href="#trabajos"
                className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-cream/80 hover:text-dusty transition-colors duration-500 whitespace-nowrap"
              >
                Ver proyectos
                <span className="grid place-items-center w-7 h-7 shrink-0 rounded-full border border-roseGold/40 group-hover:border-dusty/60 transition-colors">
                  <ArrowUpRight size={13} strokeWidth={1.25} />
                </span>
              </a>
            )}
          </div>

          {/* Mobile / tablet toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 -mr-2 text-cream hover:text-dusty transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 glass-strong flex items-center justify-center"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="flex flex-col items-center gap-8"
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl text-cream hover:text-dusty transition-colors duration-500"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}

              {/* CTA WhatsApp */}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-4"
              >
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-roseGold/40 text-dusty text-xs uppercase tracking-editorial hover:border-dusty/70 transition-all duration-500"
                >
                  <MessageCircle size={15} strokeWidth={1.25} />
                  Hablemos
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
