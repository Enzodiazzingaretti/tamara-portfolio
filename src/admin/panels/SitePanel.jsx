import TextField from "../fields/TextField";

export default function SitePanel({ draft, update, advanced = false }) {
  const s = draft.site;
  return (
    <div>
      <TextField label="Nombre" value={s.name} onChange={(v) => update(["site", "name"], v)} />
      <TextField label="Rol" value={s.role} onChange={(v) => update(["site", "role"], v)} />
      <TextField label="Frase de esencia" value={s.essence} onChange={(v) => update(["site", "essence"], v)} />
      <TextField
        label="WhatsApp (visible)"
        value={s.whatsapp}
        onChange={(v) => update(["site", "whatsapp"], v)}
        placeholder="+54 11 ..."
        hint="El número tal como querés que se vea en el sitio."
      />
      <TextField label="Ubicación" value={s.location} onChange={(v) => update(["site", "location"], v)} />
      <TextField label="Instagram" value={s.socials?.instagram} onChange={(v) => update(["site", "socials", "instagram"], v)} placeholder="https://instagram.com/..." />
      <TextField label="Behance" value={s.socials?.behance} onChange={(v) => update(["site", "socials", "behance"], v)} placeholder="https://behance.net/..." />
      <TextField label="Pinterest" value={s.socials?.pinterest} onChange={(v) => update(["site", "socials", "pinterest"], v)} placeholder="https://pinterest.com/..." />

      {advanced && (
        <div className="mt-5 pt-5 border-t border-plum/40">
          <p className="text-[11px] uppercase tracking-[0.18em] text-mauve/70 mb-3">Técnico</p>
          <TextField
            label="WhatsApp (link wa.me)"
            value={s.whatsappUrl}
            onChange={(v) => update(["site", "whatsappUrl"], v)}
            placeholder="https://wa.me/549..."
            hint="El enlace real que abre el chat al tocar el botón. Formato: https://wa.me/ + número sin espacios ni signos."
          />
          <TextField
            label="Dominio"
            value={s.domain}
            onChange={(v) => update(["site", "domain"], v)}
            placeholder="tamaragonzalez.com"
            hint="Se usa para SEO y enlaces. Normalmente no hace falta cambiarlo."
          />
        </div>
      )}
    </div>
  );
}
