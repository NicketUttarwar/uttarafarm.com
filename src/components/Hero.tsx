import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-ginger/20 bg-gradient-to-b from-cream to-ginger/5"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-ginger/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ginger">
          {t("hero.eyebrow")}
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-forest sm:text-4xl md:text-5xl"
        >
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-earth/95">
          {t("hero.subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#support"
            className="inline-flex items-center justify-center rounded-xl bg-forest px-6 py-3 text-base font-semibold text-cream shadow-sm transition hover:bg-forest-dark"
          >
            {t("hero.ctaPrimary")}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl border-2 border-forest/30 bg-white/80 px-6 py-3 text-base font-semibold text-forest transition hover:border-forest hover:bg-white"
          >
            {t("hero.ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
