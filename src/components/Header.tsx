import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const navIds = [
  { key: "mission", id: "mission" },
  { key: "ginger", id: "ginger" },
  { key: "support", id: "support" },
  { key: "region", id: "region" },
  { key: "partners", id: "partners" },
  { key: "contact", id: "contact" },
] as const;

const navClass =
  "rounded-md px-2 py-1.5 text-sm font-medium text-earth/90 hover:bg-forest/10 hover:text-forest";
const navActive =
  "rounded-md px-2 py-1.5 text-sm font-semibold bg-forest/10 text-forest";

export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <header
      className="sticky top-0 z-50 border-b border-forest/10 bg-cream/95 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-forest"
        >
          {t("brand")}
        </Link>
        <nav
          className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Primary"
        >
          {navIds.map(({ key, id }) => (
            <Link key={id} to={`/#${id}`} className={navClass}>
              {t(`nav.${key}`)}
            </Link>
          ))}
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? navActive : navClass)}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            {t("nav.about")}
          </NavLink>
          <div
            className="ml-1 flex items-center gap-0.5 rounded-lg border border-forest/20 bg-white/80 p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                locale === "en"
                  ? "bg-forest text-cream"
                  : "text-earth hover:bg-forest/10"
              }`}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("mr")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                locale === "mr"
                  ? "bg-forest text-cream"
                  : "text-earth hover:bg-forest/10"
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
