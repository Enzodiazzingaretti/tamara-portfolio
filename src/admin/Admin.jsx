import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSession } from "./api";
import Login from "./Login";
import Editor from "./Editor";

export default function Admin() {
  const [state, setState] = useState("loading"); // loading | out | in
  useEffect(() => {
    getSession().then((s) => setState(s.authenticated ? "in" : "out")).catch(() => setState("out"));
  }, []);
  if (state === "loading") {
    return (
      <div className="min-h-screen bg-noir grid place-items-center">
        <Loader2 size={26} className="animate-spin text-dusty" />
      </div>
    );
  }
  if (state === "out") return <Login onSuccess={() => setState("in")} />;
  return <Editor onLogout={() => setState("out")} />;
}
