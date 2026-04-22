import { useLanguage } from "../contexts/LanguageContext";

export function SectionRegion() {
  const { t } = useLanguage();

  return (
    <section
      id="region"
      className="scroll-mt-20 border-b border-earth/10 bg-white py-16 sm:py-20"
      aria-labelledby="region-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2
              id="region-heading"
              className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
            >
              {t("region.title")}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-earth/95">
              <p>{t("region.p1")}</p>
              <p>{t("region.p2")}</p>
            </div>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-forest/15 bg-gradient-to-br from-forest/10 to-ginger/10"
            role="img"
            aria-label="Vidarbha region placeholder"
          >
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-medium text-forest/70">
              {t("region.title")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
