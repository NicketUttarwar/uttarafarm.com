import { useLanguage } from "../contexts/LanguageContext";

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
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          <li className="rounded-xl border border-forest/15 bg-white px-5 py-4 text-base font-medium text-forest">
            {t("partners.nilesh")}
          </li>
          <li className="rounded-xl border border-forest/15 bg-white px-5 py-4 text-base font-medium text-forest">
            {t("partners.warkem")}
          </li>
        </ul>
      </div>
    </section>
  );
}
