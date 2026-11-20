import { Route, Routes, useLocation } from "react-router-dom";
import { SeoHead } from "./components/SeoHead";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SiteConstellation } from "./components/SiteConstellation";
import { useLanguage } from "./contexts/LanguageContext";
import { EightBHome } from "./eightb/EightBHome";
import { About } from "./pages/About";
import { HowWeWork } from "./pages/HowWeWork";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

function App() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isEightBHome = pathname === "/";

  return (
    <div className="relative isolate">
      <SeoHead />
      {!isEightBHome && <SiteConstellation />}
      <a
        href="#main"
        className="absolute left-[-9999px] z-[100] rounded-md bg-forest px-4 py-2 text-cream focus:left-4 focus:top-4 focus:outline-none"
      >
        {t("a11y.skipToMain")}
      </a>
      <div className="relative z-10">
        {!isEightBHome && <Header />}
        <main id="main">
          <Routes>
            <Route path="/" element={<EightBHome />} />
            <Route path="/story" element={<About />} />
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/timeline" element={<About />} />
            <Route path="/impact" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isEightBHome && <Footer />}
      </div>
    </div>
  );
}

export default App;
