import { useLanguage } from "../contexts/LanguageContext";

export function SectionPillars() {
  const { t } = useLanguage();

  const cards = [
    {
      titleKey: "pillars.knowledge.title",
      bodyKey: "pillars.knowledge.body",
    },
    {
      titleKey: "pillars.infrastructure.title",
      bodyKey: "pillars.infrastructure.body",
    },
    {
      titleKey: "pillars.markets.title",
      bodyKey: "pillars.markets.body",
    },
  ] as const;

  return (
    <section
      id="support"
      className="scroll-mt-20 border-b border-earth/10 bg-cream py-16 sm:py-20"
      aria-labelledby="support-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="support-heading"
          className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
        >
          {t("pillars.title")}
        </h2>
        <ul className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {cards.map((card, i) => (
            <li
              key={card.titleKey}
              className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ginger/15 text-sm font-bold text-ginger"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-forest">
                {t(card.titleKey)}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-earth/90">
                {t(card.bodyKey)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
