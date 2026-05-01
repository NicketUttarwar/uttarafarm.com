import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ginger">404</p>
      <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">{t("notFound.title")}</h1>
      <p className="mt-3 text-earth/90">{t("notFound.description")}</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-forest px-5 py-3 font-semibold text-cream">
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}
