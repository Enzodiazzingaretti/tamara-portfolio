import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, Download, Send, Check } from "lucide-react";
import { SITE } from "../content";
import { fadeUp, stagger } from "../utils/animations";

const LINKS = [
  { icon: Mail, label: "Email", href: `mailto:${SITE.email}`, text: SITE.email },
  { icon: Linkedin, label: "LinkedIn", href: SITE.linkedin, text: "LinkedIn" },
  { icon: Instagram, label: "Instagram", href: SITE.instagram, text: "Instagram" },
  { icon: Download, label: "CV", href: SITE.cvUrl, text: "Descargar CV" },
];

const encode = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contacto", ...form }),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="rose-divider-wide mx-auto" />
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="text-[11px] font-sans uppercase tracking-editorial text-mauve mb-4 block"
          >
            Contacto
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-display-lg font-light text-plum mb-6"
          >
            Trabajemos juntos
          </motion.h2>

          <motion.div variants={fadeUp} className="rose-divider mx-auto mb-12" />

          <motion.p
            variants={fadeUp}
            className="text-sm text-plumSoft leading-relaxed max-w-lg mx-auto mb-12"
          >
            Si estás buscando a alguien que aporte visión estratégica, creatividad
            y compromiso a tu proyecto digital, me encantaría conversar.
          </motion.p>
        </motion.div>

        {/* Contact form (glass) */}
        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          name="contacto"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 sm:p-10 text-left mb-12"
        >
          <input type="hidden" name="form-name" value="contacto" />
          <p className="hidden">
            <label>
              No llenar: <input name="bot-field" onChange={handleChange} />
            </label>
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[10px] font-sans uppercase tracking-editorial text-mauve/80 mb-2 block">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl glass-soft px-4 py-3 text-sm text-plum placeholder-plumSoft/40 outline-none focus:border-dusty/60 transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="text-[10px] font-sans uppercase tracking-editorial text-mauve/80 mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl glass-soft px-4 py-3 text-sm text-plum placeholder-plumSoft/40 outline-none focus:border-dusty/60 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-sans uppercase tracking-editorial text-mauve/80 mb-2 block">
              Mensaje
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl glass-soft px-4 py-3 text-sm text-plum placeholder-plumSoft/40 outline-none focus:border-dusty/60 transition-colors resize-none"
              placeholder="Contame sobre tu proyecto…"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full glass-strong text-mauve text-xs uppercase tracking-editorial hover:shadow-glass-lg transition-all duration-500 disabled:opacity-70"
          >
            {status === "sent" ? (
              <>
                <Check size={15} strokeWidth={1.5} /> ¡Mensaje enviado!
              </>
            ) : status === "sending" ? (
              "Enviando…"
            ) : (
              <>
                Enviar mensaje
                <Send
                  size={14}
                  strokeWidth={1.5}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </>
            )}
          </button>

          {status === "error" && (
            <p className="text-xs text-mauve mt-4">
              Hubo un problema al enviar. Escribime directo a{" "}
              <a href={`mailto:${SITE.email}`} className="underline">
                {SITE.email}
              </a>
              .
            </p>
          )}
        </motion.form>

        {/* Quick links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {LINKS.map(({ icon: Icon, label, href, text }) => (
            <motion.a
              key={label}
              variants={fadeUp}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl glass hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-500"
            >
              <Icon
                size={18}
                strokeWidth={1.25}
                className="text-mauve group-hover:text-dusty transition-colors duration-500"
              />
              <span className="text-xs uppercase tracking-editorial text-plumSoft group-hover:text-plum transition-colors duration-500">
                {text}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
