import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import "@fontsource/outfit/latin-400.css";
import "./styles.css";

// Pesos/script só depois do first paint
const deferFonts = () => {
  import("@fontsource/outfit/latin-300.css");
  import("@fontsource/outfit/latin-500.css");
  import("@fontsource/outfit/latin-600.css");
  import("@fontsource/great-vibes/latin-400.css");
};
if (typeof window !== "undefined") {
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
  schedule(deferFonts);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
