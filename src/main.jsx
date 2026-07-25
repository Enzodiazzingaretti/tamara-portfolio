import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Admin from "./admin/Admin";
import { ContentProvider } from "./ContentContext";
import "./index.css";

const isAdmin = window.location.pathname.replace(/\/$/, "") === "/admin";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    {isAdmin ? (
      <Admin />
    ) : (
      <ContentProvider>
        <App />
      </ContentProvider>
    )}
  </StrictMode>,
);
