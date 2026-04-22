import { useLanguage } from "../contexts/LanguageContext";

export function SectionMission() {
  const { t } = useLanguage();

  return (
    <section
      id="mission"
      className="scroll-mt-20 border-b border-earth/10 bg-cream py-16 sm:py-20"
      aria-labelledby="mission-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="mission-heading"
          className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
        >
          {t("mission.title")}
        </h2>
        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-earth/95">
          <p>{t("mission.p1")}</p>
          <p>{t("mission.p2")}</p>
        </div>
      </div>
    </section>
  );
}
