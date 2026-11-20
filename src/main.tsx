import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import { SmoothScroll } from "./motion/SmoothScroll.tsx";
import "lenis/dist/lenis.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
