import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { SpinMark } from "./SpinMark";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-forest/15 bg-moss text-sand/90"
      role="contentinfo"
    >
      <SpinMark
        tone="sky"
        duration={36}
        className="pointer-events-none absolute -left-2 top-6 text-4xl opacity-25"
      />
      <SpinMark
        tone="sand"
        duration={48}
        reverse
        className="pointer-events-none absolute -right-1 bottom-4 text-5xl opacity-20"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-4 text-sm">
          <SpinMark tone="ginger" duration={22} className="text-sm opacity-70" />
          <Link className="hover:text-sand" to="/">{t("nav.home")}</Link>
          <Link className="hover:text-sand" to="/story">{t("nav.story")}</Link>
          <Link className="hover:text-sand" to="/how-we-work">{t("nav.howWeWork")}</Link>
          <Link className="hover:text-sand" to="/contact">{t("nav.contact")}</Link>
          <SpinMark tone="sky" duration={28} reverse className="text-sm opacity-70" />
        </div>
        <p className="text-center text-sm">
          © {year} {t("footer.rights")}
        </p>
        <p className="mt-2 text-center text-xs text-sand/60">{t("footer.note")}</p>
      </div>
    </footer>
  );
}
