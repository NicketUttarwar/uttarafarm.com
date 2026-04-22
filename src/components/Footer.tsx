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
        <p className="text-center text-sm">
          © {year} {t("footer.rights")}
        </p>
        <p className="mt-2 text-center text-xs text-cream/60">{t("footer.note")}</p>
      </div>
    </footer>
  );
}
