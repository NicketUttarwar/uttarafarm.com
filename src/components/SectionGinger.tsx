import { useLanguage } from "../contexts/LanguageContext";

export function SectionGinger() {
  const { t } = useLanguage();

  return (
    <section
      id="ginger"
      className="scroll-mt-20 border-b border-earth/10 bg-white py-16 sm:py-20"
      aria-labelledby="ginger-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="ginger-heading"
          className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
        >
          {t("ginger.title")}
        </h2>
        <p className="mt-6 max-w-3xl text-xl font-medium leading-relaxed text-forest/90">
          {t("ginger.lead")}
        </p>
        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-earth/95">
          <p>{t("ginger.p1")}</p>
          <p>{t("ginger.p2")}</p>
        </div>
      </div>
    </section>
  );
}
