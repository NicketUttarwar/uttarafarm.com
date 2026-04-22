import { Route, Routes } from "react-router-dom";
import { SeoHead } from "./components/SeoHead";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useLanguage } from "./contexts/LanguageContext";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

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
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
