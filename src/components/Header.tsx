import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const navItems = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.story", to: "/story" },
  { labelKey: "nav.howWeWork", to: "/how-we-work" },
  { labelKey: "nav.contact", to: "/contact" },
] as const;

const navClass =
  "rounded-md px-2 py-1.5 text-sm font-medium text-earth/90 hover:bg-forest/10 hover:text-forest";
const navActive =
  "rounded-md px-2 py-1.5 text-sm font-semibold bg-forest/10 text-forest";

export function Header() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header
      className="sticky top-0 z-50 border-b border-forest/10 bg-cream/95 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="brand-wordmark text-2xl text-forest"
        >
          {t("brand")}
        </Link>
        <nav
          className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label={t("a11y.primaryNav")}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? navActive : navClass)}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
          <div
            className="ml-1 flex items-center gap-0.5 rounded-lg border border-forest/20 bg-white/80 p-0.5"
            role="group"
            aria-label={t("a11y.languageToggle")}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                locale === "en" ? "bg-forest text-cream" : "text-earth hover:bg-forest/10"
              }`}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("mr")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                locale === "mr" ? "bg-forest text-cream" : "text-earth hover:bg-forest/10"
              }`}
              aria-pressed={locale === "mr"}
            >
              मराठी
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
