import { useRef } from "react";
import { Link } from "react-router-dom";
import { AmbientDecor } from "../components/AmbientDecor";
import { ParallaxField } from "../components/ParallaxField";
import { SectionContact } from "../components/SectionContact";
import { SectionRegion } from "../components/SectionRegion";
import { SpinMark } from "../components/SpinMark";
import { useLanguage } from "../contexts/LanguageContext";
import { assetUrl } from "../lib/assets";
import { useHomeMotion } from "../motion/useHomeMotion";

const facts = [
  { labelKey: "homeLanding.facts.focusLabel", valueKey: "homeLanding.facts.focusValue" },
  { labelKey: "homeLanding.facts.cropsLabel", valueKey: "homeLanding.facts.cropsValue" },
  { labelKey: "homeLanding.facts.seasonLabel", valueKey: "homeLanding.facts.seasonValue" },
  { labelKey: "homeLanding.facts.farmersLabel", valueKey: "homeLanding.facts.farmersValue" },
] as const;

const offers = [
  {
    titleKey: "homeLanding.offers.advise.title",
    bodyKey: "homeLanding.offers.advise.body",
    metaKey: "homeLanding.offers.advise.meta",
    tone: "bg-bone text-earth",
  },
  {
    titleKey: "homeLanding.offers.soil.title",
    bodyKey: "homeLanding.offers.soil.body",
    metaKey: "homeLanding.offers.soil.meta",
    tone: "bg-sage/35 text-earth",
  },
  {
    titleKey: "homeLanding.offers.sales.title",
    bodyKey: "homeLanding.offers.sales.body",
    metaKey: "homeLanding.offers.sales.meta",
    tone: "bg-moss text-sand",
  },
  {
    titleKey: "homeLanding.offers.root.title",
    bodyKey: "homeLanding.offers.root.body",
    metaKey: "homeLanding.offers.root.meta",
    tone: "bg-ginger text-earth",
  },
] as const;

const tools = [
  {
    nameKey: "homeLanding.tools.haldi.name",
    typeKey: "homeLanding.tools.haldi.type",
    aKey: "homeLanding.tools.haldi.a",
    bKey: "homeLanding.tools.haldi.b",
  },
  {
    nameKey: "homeLanding.tools.adrak.name",
    typeKey: "homeLanding.tools.adrak.type",
    aKey: "homeLanding.tools.adrak.a",
    bKey: "homeLanding.tools.adrak.b",
  },
  {
    nameKey: "homeLanding.tools.soil.name",
    typeKey: "homeLanding.tools.soil.type",
    aKey: "homeLanding.tools.soil.a",
    bKey: "homeLanding.tools.soil.b",
  },
  {
    nameKey: "homeLanding.tools.route.name",
    typeKey: "homeLanding.tools.route.type",
    aKey: "homeLanding.tools.route.a",
    bKey: "homeLanding.tools.route.b",
  },
] as const;

const steps = [
  {
    stepKey: "homeLanding.path.s1.step",
    titleKey: "homeLanding.path.s1.title",
    bodyKey: "homeLanding.path.s1.body",
  },
  {
    stepKey: "homeLanding.path.s2.step",
    titleKey: "homeLanding.path.s2.title",
    bodyKey: "homeLanding.path.s2.body",
  },
  {
    stepKey: "homeLanding.path.s3.step",
    titleKey: "homeLanding.path.s3.title",
    bodyKey: "homeLanding.path.s3.body",
  },
  {
    stepKey: "homeLanding.path.s4.step",
    titleKey: "homeLanding.path.s4.title",
    bodyKey: "homeLanding.path.s4.body",
  },
  {
    stepKey: "homeLanding.path.s5.step",
    titleKey: "homeLanding.path.s5.title",
    bodyKey: "homeLanding.path.s5.body",
  },
  {
    stepKey: "homeLanding.path.s6.step",
    titleKey: "homeLanding.path.s6.title",
    bodyKey: "homeLanding.path.s6.body",
  },
] as const;

const joinPlans = [
  {
    titleKey: "homeLanding.join.individual.title",
    bodyKey: "homeLanding.join.individual.body",
    ctaKey: "homeLanding.join.individual.cta",
    featured: false,
  },
  {
    titleKey: "homeLanding.join.cooperative.title",
    bodyKey: "homeLanding.join.cooperative.body",
    ctaKey: "homeLanding.join.cooperative.cta",
    featured: true,
  },
  {
    titleKey: "homeLanding.join.contract.title",
    bodyKey: "homeLanding.join.contract.body",
    ctaKey: "homeLanding.join.contract.cta",
    featured: false,
  },
] as const;

export function Home() {
  const { t, locale } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  useHomeMotion(rootRef, locale);

  return (
    <div ref={rootRef} key={locale}>
      <section
        id="top"
        data-hero
        className="grain-overlay relative overflow-hidden border-b border-forest/10"
        aria-labelledby="hero-heading"
      >
        <div
          data-orb
          className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky/30 blur-3xl"
          aria-hidden
        />
        <div
          data-orb
          className="pointer-events-none absolute -right-10 top-24 h-48 w-48 rounded-full bg-ginger/20 blur-3xl"
          aria-hidden
        />
        <div
          data-orb
          className="pointer-events-none absolute bottom-8 left-[35%] h-40 w-40 rounded-full bg-forest/10 blur-3xl"
          aria-hidden
        />
        <ParallaxField variant="light" />
        <AmbientDecor variant="light" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
          <p
            data-reveal
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ginger"
          >
            <SpinMark tone="ginger" duration={18} className="text-xs" />
            {t("homeLanding.eyebrow")}
          </p>

          <div
            data-hero-facts
            data-stagger
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {facts.map((fact) => (
              <p
                key={fact.labelKey}
                className="border-l-2 border-forest/25 pl-3 text-sm text-earth/80"
              >
                <span className="font-semibold text-forest">{t(fact.labelKey)}</span>
                <span className="mx-2 text-sky">—</span>
                <span>{t(fact.valueKey)}</span>
              </p>
            ))}
          </div>

          <h1
            id="hero-heading"
            data-hero-word
            data-stretch
            className="display-wordmark mt-10 text-[clamp(3.5rem,16vw,9.5rem)] text-sky sm:mt-14"
          >
            {t("homeLanding.wordmark")}
          </h1>

          <div
            data-hero-frame
            data-parallax
            className="relative mt-6 overflow-hidden rounded-sm sm:mt-8"
          >
            <img
              src={assetUrl("stevia-plant-realistic.jpg")}
              alt={t("homeLanding.heroImageAlt")}
              className="h-[min(52vh,28rem)] w-full object-cover will-change-transform"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-moss/85 via-moss/25 to-transparent" />
            <p
              data-hero-cap
              className="absolute inset-x-0 bottom-0 max-w-3xl p-5 text-base leading-relaxed text-sand sm:p-8 sm:text-lg"
            >
              {t("homeLanding.heroCaption")}
            </p>
          </div>

          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <a
              href="#support"
              className="inline-flex items-center justify-center rounded-sm bg-ginger px-5 py-3 text-sm font-semibold text-earth transition hover:brightness-105"
            >
              {t("homeLanding.ctaPrimary")}
            </a>
            <Link
              to="/story"
              className="inline-flex items-center justify-center rounded-sm border border-forest/30 bg-paper/80 px-5 py-3 text-sm font-semibold text-forest transition hover:border-forest"
            >
              {t("homeLanding.ctaStory")}
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-sm border border-transparent px-5 py-3 text-sm font-semibold text-forest underline decoration-ginger/50 underline-offset-4 hover:decoration-ginger"
            >
              {t("homeLanding.ctaSecondary")}
            </a>
          </div>
        </div>
      </section>

      <section
        id="story-teaser"
        className="relative overflow-hidden border-b border-forest/10 bg-sage/25 py-16 sm:py-20"
        aria-labelledby="story-teaser-heading"
      >
        <ParallaxField variant="light" />
        <AmbientDecor variant="light" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <h2
            id="story-teaser-heading"
            data-stretch
            className="display-wordmark text-3xl text-forest sm:text-5xl"
          >
            {t("homeLanding.storyTeaser.title")}
          </h2>
          <div data-reveal>
            <p className="mt-6 text-lg leading-relaxed text-earth/90">
              {t("homeLanding.storyTeaser.p1")}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-earth/90">
              <mark className="bg-ginger/20 px-1 text-earth">
                {t("homeLanding.storyTeaser.highlight")}
              </mark>{" "}
              {t("homeLanding.storyTeaser.p2")}
            </p>
            <Link
              to="/story"
              className="mt-8 inline-flex font-semibold text-forest underline decoration-ginger/40 underline-offset-4 hover:decoration-ginger"
            >
              {t("homeLanding.storyTeaser.link")} →
            </Link>
          </div>
        </div>
      </section>

      <section
        id="support"
        className="relative scroll-mt-24 overflow-hidden border-b border-forest/10 bg-sand py-16 sm:py-20"
        aria-labelledby="support-heading"
      >
        <ParallaxField variant="light" />
        <div
          data-depth
          data-speed="0.2"
          className="pointer-events-none absolute right-[4%] top-10 text-5xl opacity-30"
        >
          <SpinMark tone="sky" duration={42} />
        </div>
        <div
          data-depth
          data-speed="-0.16"
          className="pointer-events-none absolute bottom-8 left-[3%] text-4xl opacity-25"
        >
          <SpinMark tone="ginger" duration={30} reverse />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div data-reveal>
            <h2
              id="support-heading"
              data-stretch
              className="display-wordmark max-w-2xl text-3xl text-forest sm:text-5xl"
            >
              {t("homeLanding.offers.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-earth/90">
              {t("homeLanding.offers.intro")}
            </p>
          </div>
          <ul data-stagger data-parallax-rail className="mt-10 grid gap-5 sm:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.titleKey}>
                <article
                  data-parallax-card
                  className={`flex h-full flex-col justify-between rounded-sm border border-forest/10 p-6 shadow-sm will-change-transform ${offer.tone}`}
                >
                  <div>
                    <h3 className="display-wordmark text-3xl sm:text-4xl">{t(offer.titleKey)}</h3>
                    <p className="mt-4 text-base leading-relaxed opacity-90">{t(offer.bodyKey)}</p>
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                    {t(offer.metaKey)}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="crops"
        className="relative overflow-hidden border-b border-forest/10 bg-moss py-16 text-sand sm:py-20"
        aria-labelledby="crops-heading"
      >
        <ParallaxField variant="dark" />
        <AmbientDecor variant="dark" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div data-reveal>
            <h2
              id="crops-heading"
              data-stretch
              className="display-wordmark max-w-3xl text-3xl text-sky sm:text-5xl"
            >
              {t("homeLanding.tools.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sand/85">
              {t("homeLanding.tools.intro")}
            </p>
          </div>
          <ul data-stagger data-parallax-rail className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <li key={tool.nameKey}>
                <article
                  data-parallax-card
                  className="h-full rounded-sm border border-sand/15 bg-sand/5 p-5 backdrop-blur-sm will-change-transform"
                >
                  <h3 className="display-wordmark text-3xl text-sky">{t(tool.nameKey)}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand/60">
                    {t(tool.typeKey)}
                  </p>
                  <dl className="mt-5 space-y-2 text-sm text-sand/85">
                    <div className="flex justify-between gap-3 border-t border-sand/15 pt-2">
                      <dt className="text-sand/55">{t("homeLanding.tools.specA")}</dt>
                      <dd className="text-right font-medium">{t(tool.aKey)}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-sand/15 pt-2">
                      <dt className="text-sand/55">{t("homeLanding.tools.specB")}</dt>
                      <dd className="text-right font-medium">{t(tool.bKey)}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="season"
        className="relative overflow-hidden border-b border-forest/10 py-16 sm:py-20"
        aria-labelledby="season-heading"
      >
        <ParallaxField variant="light" />
        <AmbientDecor variant="light" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div data-reveal>
            <h2
              id="season-heading"
              data-stretch
              className="display-wordmark max-w-3xl text-3xl text-forest sm:text-5xl"
            >
              {t("homeLanding.path.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-earth/90">
              {t("homeLanding.path.intro")}
            </p>
          </div>

          <ol data-path className="relative mt-12 space-y-0 pl-6 sm:pl-8">
            <span
              data-path-line
              className="absolute bottom-2 left-[0.55rem] top-2 w-0.5 origin-top bg-forest/25 sm:left-[0.7rem]"
              aria-hidden
            />
            {steps.map((step) => (
              <li key={step.titleKey} data-path-step className="relative pb-10 last:pb-0">
                <span
                  data-path-dot
                  className="absolute -left-[1.35rem] top-1.5 h-3.5 w-3.5 rounded-full bg-ginger sm:-left-[1.55rem]"
                  aria-hidden
                />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ginger">
                  {t(step.stepKey)}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-forest sm:text-2xl">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-earth/90">{t(step.bodyKey)}</p>
              </li>
            ))}
          </ol>

            <div
            data-kharif
            className="mt-12 overflow-hidden rounded-sm bg-ginger px-6 py-8 text-earth sm:px-8 sm:py-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth/70">
              {t("homeLanding.kharif.badge")}
            </p>
            <h3 className="mt-3 display-wordmark text-2xl text-earth sm:text-4xl">
              {t("homeLanding.kharif.title")}
            </h3>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/95">
              {t("homeLanding.kharif.body")}
            </p>
          </div>
        </div>
      </section>

      <SectionRegion />

      <section
        id="join"
        className="relative overflow-hidden border-b border-forest/10 bg-cream/80 py-16 sm:py-20"
        aria-labelledby="join-heading"
      >
        <ParallaxField variant="light" />
        <div
          data-depth
          data-speed="0.18"
          className="pointer-events-none absolute left-[5%] top-12 text-4xl opacity-25"
        >
          <SpinMark tone="forest" duration={36} />
        </div>
        <div
          data-depth
          data-speed="-0.22"
          className="pointer-events-none absolute bottom-10 right-[6%] text-5xl opacity-30"
        >
          <SpinMark tone="ginger" duration={24} reverse />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div data-reveal>
            <h2
              id="join-heading"
              data-stretch
              className="display-wordmark max-w-2xl text-3xl text-forest sm:text-5xl"
            >
              {t("homeLanding.join.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-earth/90">
              {t("homeLanding.join.intro")}
            </p>
          </div>
          <ul data-stagger data-parallax-rail className="mt-10 grid gap-5 lg:grid-cols-3">
            {joinPlans.map((plan) => (
              <li key={plan.titleKey}>
                <article
                  data-parallax-card
                  className={`flex h-full flex-col rounded-sm border p-6 shadow-sm will-change-transform ${
                    plan.featured
                      ? "border-ginger/40 bg-ginger text-earth"
                      : "border-forest/10 bg-white"
                  }`}
                >
                  <h3 className="display-wordmark text-3xl">{t(plan.titleKey)}</h3>
                  <p className="mt-4 flex-1 leading-relaxed opacity-90">{t(plan.bodyKey)}</p>
                  <a
                    href="#contact"
                    className={`mt-6 inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-moss text-sand hover:brightness-110"
                        : "bg-forest text-sand hover:bg-forest-dark"
                    }`}
                  >
                    {t(plan.ctaKey)}
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionContact />
    </div>
  );
}
