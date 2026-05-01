import { useLanguage } from "../contexts/LanguageContext";
import { assetUrl } from "../lib/assets";

export function SectionPartners() {
  const { t } = useLanguage();

  return (
    <section
      id="partners"
      className="scroll-mt-20 border-b border-earth/10 bg-cream py-16 sm:py-20"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="partners-heading"
          className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
        >
          {t("partners.title")}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-earth/95">
          {t("partners.body")}
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          <li className="overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-sm">
            <img
              src={assetUrl("nilesh-placeholder.svg")}
              alt={t("partners.nileshImageAlt")}
              className="h-48 w-full bg-cream/40 object-contain p-3"
              loading="lazy"
              decoding="async"
            />
            <div className="border-t border-forest/10 px-5 py-4">
              <p className="text-base font-semibold text-forest">{t("partners.nilesh")}</p>
              <p className="mt-1 text-sm text-earth/80">{t("partners.nileshImageCaption")}</p>
            </div>
          </li>
          <li className="overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-sm">
            <img
              src={assetUrl("warkem-logo.png")}
              alt={t("partners.warkemImageAlt")}
              className="h-48 w-full bg-cream/40 object-contain p-3"
              loading="lazy"
              decoding="async"
            />
            <div className="border-t border-forest/10 px-5 py-4">
              <p className="text-base font-semibold text-forest">{t("partners.warkem")}</p>
              <a
                href="https://www.warkembioagri.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-forest underline decoration-ginger/50 underline-offset-4 hover:decoration-ginger"
              >
                {t("partners.visitWebsite")}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
