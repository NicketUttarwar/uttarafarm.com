import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-forest/15 bg-forest-dark text-cream/90"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap justify-center gap-4 text-sm">
          <Link className="hover:text-cream" to="/">Home</Link>
          <Link className="hover:text-cream" to="/story">Story</Link>
          <Link className="hover:text-cream" to="/how-we-work">How We Work</Link>
          <Link className="hover:text-cream" to="/contact">Contact</Link>
        </div>
        <p className="text-center text-sm">
          © {year} {t("footer.rights")}
        </p>
        <p className="mt-2 text-center text-xs text-cream/60">{t("footer.note")}</p>
      </div>
    </footer>
  );
}
