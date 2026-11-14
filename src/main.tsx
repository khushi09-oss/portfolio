import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "./styles.css";
import "./worlds.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Legacy fragments and return queries can select content different from the static page.
if (
  root.dataset.page === (location.pathname.replace(/\/$/, "") || "/") &&
  !location.hash &&
  !location.search
)
  ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
