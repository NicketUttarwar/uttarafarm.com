import { useRef } from "react";
import { Link } from "react-router-dom";
import { AmbientDecor } from "../components/AmbientDecor";
import { SpinMark } from "../components/SpinMark";
import { useLanguage } from "../contexts/LanguageContext";
import { assetUrl } from "../lib/assets";
import { usePageMotion } from "../motion/usePageMotion";

const brandMilestones = [
  {
    src: assetUrl("naturell.jpeg"),
    altKey: "aboutPage.brands.naturell.alt" as const,
    titleKey: "aboutPage.brands.naturell.title" as const,
    bodyKey: "aboutPage.brands.naturell.body" as const,
  },
  {
    src: assetUrl("ritebite-maxprotein.webp"),
    altKey: "aboutPage.brands.maxProtein.alt" as const,
    titleKey: "aboutPage.brands.maxProtein.title" as const,
    bodyKey: "aboutPage.brands.maxProtein.body" as const,
  },
  {
    src: assetUrl("ZYDUSWELL.NS_BIG-a4dd0276.png"),
    altKey: "aboutPage.brands.zydus.alt" as const,
    titleKey: "aboutPage.brands.zydus.title" as const,
    bodyKey: "aboutPage.brands.zydus.body" as const,
  },
] as const;

const storySections = [
  {
    id: "roots",
    titleKey: "aboutPage.sections.roots.title" as const,
    paragraphs: [
      "aboutPage.sections.roots.p1",
      "aboutPage.sections.roots.p2",
      "aboutPage.sections.roots.p3",
    ] as const,
  },
  {
    id: "education",
    titleKey: "aboutPage.sections.education.title" as const,
    paragraphs: [
      "aboutPage.sections.education.p1",
      "aboutPage.sections.education.p2",
      "aboutPage.sections.education.p3",
    ] as const,
  },
  {
    id: "america",
    titleKey: "aboutPage.sections.america.title" as const,
    paragraphs: [
      "aboutPage.sections.america.p1",
      "aboutPage.sections.america.p2",
    ] as const,
  },
  {
    id: "return",
    titleKey: "aboutPage.sections.return.title" as const,
    paragraphs: ["aboutPage.sections.return.p1", "aboutPage.sections.return.p2"] as const,
  },
] as const;

const afterBrandsSections = [
  {
    id: "uttara",
    titleKey: "aboutPage.sections.uttara.title" as const,
    paragraphs: [
      "aboutPage.sections.uttara.p1",
      "aboutPage.sections.uttara.p2",
      "aboutPage.sections.uttara.p3",
      "aboutPage.sections.uttara.p4",
    ] as const,
  },
  {
    id: "circle",
    titleKey: "aboutPage.sections.circle.title" as const,
    paragraphs: ["aboutPage.sections.circle.p1"] as const,
  },
] as const;

export function About() {
  const { t, locale } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  usePageMotion(rootRef, locale);

  return (
    <article ref={rootRef} key={locale} className="border-b border-earth/10">
      <header
        data-reveal
        className="relative overflow-hidden border-b border-ginger/20 bg-gradient-to-b from-sand to-ginger/10"
      >
        <AmbientDecor variant="light" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ginger">
            <SpinMark tone="ginger" duration={20} className="text-xs" />
            {t("aboutPage.badge")}
          </p>
          <h1 className="mt-3 display-wordmark text-3xl text-forest sm:text-5xl">
            {t("aboutPage.title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-earth/95">
            {t("aboutPage.lead")}
          </p>
        </div>
      </header>

      {storySections.map((section) => (
        <section
          key={section.id}
          data-reveal
          className="border-t border-earth/10 py-12 sm:py-16"
          aria-labelledby={`${section.id}-heading`}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              id={`${section.id}-heading`}
              className="display-wordmark text-2xl text-forest sm:text-4xl"
            >
              {t(section.titleKey)}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-earth/95">
              {section.paragraphs.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section
        className="relative overflow-hidden border-t border-earth/10 bg-paper/50 py-12 sm:py-16"
        aria-labelledby="brands-heading"
      >
        <SpinMark
          tone="sky"
          duration={40}
          className="pointer-events-none absolute right-[5%] top-8 text-5xl opacity-25"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div data-reveal>
            <h2
              id="brands-heading"
              className="display-wordmark text-2xl text-forest sm:text-4xl"
            >
              {t("aboutPage.brands.title")}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
              {t("aboutPage.brands.intro")}
            </p>
          </div>
          <ul className="mt-10 grid gap-8 lg:grid-cols-3">
            {brandMilestones.map((item) => (
              <li
                key={item.src}
                data-reveal
                data-parallax
                className="overflow-hidden rounded-sm border border-forest/15 bg-white p-4 shadow-sm"
              >
                <div className="overflow-hidden rounded-sm bg-sand/40">
                  <img
                    src={item.src}
                    alt={t(item.altKey)}
                    className="h-44 w-full object-contain p-2 sm:h-48"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-forest">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-earth/90">
                  {t(item.bodyKey)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {afterBrandsSections.map((section) => (
        <section
          key={section.id}
          data-reveal
          className="border-t border-earth/10 py-12 sm:py-16"
          aria-labelledby={`${section.id}-heading`}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              id={`${section.id}-heading`}
              className="display-wordmark text-2xl text-forest sm:text-4xl"
            >
              {t(section.titleKey)}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-earth/95">
              {section.paragraphs.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div data-reveal className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center font-semibold text-forest underline decoration-ginger/40 underline-offset-4 hover:decoration-ginger"
        >
          ← {t("aboutPage.backHome")}
        </Link>
      </div>
    </article>
  );
}
