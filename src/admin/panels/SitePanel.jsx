import TextField from "../fields/TextField";

export default function SitePanel({ draft, update }) {
  const s = draft.site;
  return (
    <div>
      <TextField label="Nombre" value={s.name} onChange={(v) => update(["site", "name"], v)} />
      <TextField label="Rol" value={s.role} onChange={(v) => update(["site", "role"], v)} />
      <TextField label="Frase de esencia" value={s.essence} onChange={(v) => update(["site", "essence"], v)} />
      <TextField label="WhatsApp (visible)" value={s.whatsapp} onChange={(v) => update(["site", "whatsapp"], v)} placeholder="+54 11 ..." />
      <TextField label="WhatsApp (link wa.me)" value={s.whatsappUrl} onChange={(v) => update(["site", "whatsappUrl"], v)} placeholder="https://wa.me/549..." />
      <TextField label="Ubicación" value={s.location} onChange={(v) => update(["site", "location"], v)} />
      <TextField label="Dominio" value={s.domain} onChange={(v) => update(["site", "domain"], v)} placeholder="tamaragonzalez.com" />
      <TextField label="Instagram" value={s.socials?.instagram} onChange={(v) => update(["site", "socials", "instagram"], v)} />
      <TextField label="Behance" value={s.socials?.behance} onChange={(v) => update(["site", "socials", "behance"], v)} />
      <TextField label="Pinterest" value={s.socials?.pinterest} onChange={(v) => update(["site", "socials", "pinterest"], v)} />
    </div>
  );
}
