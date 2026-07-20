import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE } from "../content";

/* Botón flotante de WhatsApp: aparece después de scrollear el hero. */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribime por WhatsApp"
          className="fixed bottom-6 right-6 z-40 grid place-items-center w-14 h-14 rounded-full glass-strong text-dusty hover:text-rose hover:shadow-glass-lg transition-all duration-500"
        >
          <MessageCircle size={22} strokeWidth={1.25} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
