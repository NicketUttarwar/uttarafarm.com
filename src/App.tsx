import { Route, Routes } from "react-router-dom";
import { SeoHead } from "./components/SeoHead";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useLanguage } from "./contexts/LanguageContext";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { HowWeWork } from "./pages/HowWeWork";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

function App() {
  const { t } = useLanguage();

  return (
    <>
      <SeoHead />
      <a
        href="#main"
        className="absolute left-[-9999px] z-[100] rounded-md bg-forest px-4 py-2 text-cream focus:left-4 focus:top-4 focus:outline-none"
      >
        {t("a11y.skipToMain")}
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<About />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/timeline" element={<About />} />
          <Route path="/impact" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
