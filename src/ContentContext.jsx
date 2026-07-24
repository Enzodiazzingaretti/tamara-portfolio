import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULTS, loadContent } from "./content";

const Ctx = createContext(DEFAULTS);

export function ContentProvider({ children, initial = DEFAULTS }) {
  const [content, setContent] = useState(initial);
  useEffect(() => {
    let alive = true;
    loadContent().then((c) => { if (alive) setContent(c); });
    return () => { alive = false; };
  }, []);
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export function useContent() {
  return useContext(Ctx);
}
