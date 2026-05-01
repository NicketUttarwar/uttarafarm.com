import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { assetUrl } from "../lib/assets";

const storyImages = [
  {
    src: assetUrl("naturell.jpeg"),
    altKey: "aboutPage.story.altNaturell" as const,
    titleKey: "aboutPage.story.naturellTitle" as const,
    bodyKey: "aboutPage.story.naturellBody" as const,
  },
  {
    src: assetUrl("stevia-sapling.svg"),
    altKey: "aboutPage.story.altStevia" as const,
    titleKey: "aboutPage.story.ritebiteTitle" as const,
    bodyKey: "aboutPage.story.ritebiteBody" as const,
  },
  {
    src: assetUrl("ritebite-maxprotein.webp"),
    altKey: "aboutPage.story.altMaxProteinLaunch" as const,
    titleKey: "aboutPage.story.maxProteinTitle" as const,
    bodyKey: "aboutPage.story.maxProteinBody" as const,
  },
  {
    src: assetUrl("zydus-max-protein.jpeg"),
    altKey: "aboutPage.story.altMaxProteinScale" as const,
    titleKey: "aboutPage.story.scaleTitle" as const,
    bodyKey: "aboutPage.story.scaleBody" as const,
  },
  {
    src: assetUrl("ZYDUSWELL.NS_BIG-a4dd0276.png"),
    altKey: "aboutPage.story.altZydus" as const,
    titleKey: "aboutPage.story.zydusTitle" as const,
    bodyKey: "aboutPage.story.zydusBody" as const,
  },
];

const additionalImages = [
  {
    src: assetUrl("UttaraFarmsLogo.png"),
    altKey: "aboutPage.gallery.extraLogoAlt" as const,
    titleKey: "aboutPage.gallery.extraLogoTitle" as const,
    bodyKey: "aboutPage.gallery.extraLogoBody" as const,
  },
  {
    src: assetUrl("ritebite.webp"),
    altKey: "aboutPage.gallery.extraRitebiteAlt" as const,
    titleKey: "aboutPage.gallery.extraRitebiteTitle" as const,
    bodyKey: "aboutPage.gallery.extraRitebiteBody" as const,
  },
] as const;

const timelineEvents = [
  {
    phase: "Act 1",
    angle: -90,
    title: "Bhamb roots and a bigger dream",
    detail:
      "Vijay grew up in Bhamb near Ralegaon, where farming shaped everyday life. That early exposure stayed with him while he built his professional career.",
  },
  {
    phase: "Act 1",
    angle: -30,
    title: "Naturell begins with a health-first mission",
    detail:
      "Naturell started with the vision of combining healthier food products with long-term value creation.",
  },
  {
    phase: "Act 2",
    angle: 30,
    title: "Setback, pivot, and product learning",
    detail:
      "After early regulatory challenges, the team pivoted into nutrition snacks and steadily improved product fit, positioning, and category understanding.",
  },
  {
    phase: "Act 2",
    angle: 90,
    title: "RiteBite and Max Protein scale nationally",
    detail:
      "Focused innovation, wider distribution, and clear consumer use-cases helped build RiteBite and Max Protein into widely recognized brands.",
  },
  {
    phase: "Act 3",
    angle: 150,
    title: "Naturell joins Zydus Wellness",
    detail:
      "The 2024 transaction with Zydus Wellness marked a major milestone and validated years of brand-building and execution.",
  },
  {
    phase: "Act 3",
    angle: 210,
    title: "Success circles back to village impact",
    detail:
      "With the Naturell journey at scale, Vijay turned his attention to giving back to Bhamb, Ralegaon, and nearby farming communities through Uttara Farm.",
  },
] as const;

const impactGroups = [
  {
    title: "People and teams",
    points: [
      "Employees and contributors participated in value creation as the company scaled.",
      "A continuity-focused approach protected long-term careers and capability building.",
    ],
  },
  {
    title: "Investors and shareholders",
    points: [
      "The growth journey created meaningful outcomes for early risk capital.",
      "Execution discipline and category expansion translated into durable enterprise value.",
    ],
  },
  {
    title: "Strategic ecosystem",
    points: [
      "The Zydus partnership enabled the brands to move onto a larger national platform.",
      "Suppliers, channel partners, and stakeholders benefited from a stronger scaled network.",
    ],
  },
  {
    title: "Village communities in Vidarbha",
    points: [
      "Experience and networks from this entrepreneurial journey now feed back into rural initiatives.",
      "Uttara Farm is designed to convert private success into public rural opportunity.",
    ],
  },
] as const;

export function About() {
  const { t } = useLanguage();
  const [activeGalleryTab, setActiveGalleryTab] = useState<"included" | "extra">("included");

  return (
    <article className="border-b border-earth/10">
      <header className="border-b border-ginger/20 bg-gradient-to-b from-cream to-ginger/5">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-ginger">
            {t("aboutPage.badge")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-forest sm:text-4xl">
            {t("aboutPage.title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-earth/95">
            {t("aboutPage.lead")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-lg leading-relaxed text-earth/95 sm:px-6 sm:py-16">
        <p>{t("aboutPage.p1")}</p>
        <p>{t("aboutPage.p2")}</p>
        <p>{t("aboutPage.p3")}</p>
        <p>{t("aboutPage.p4")}</p>
      </div>

      <section className="border-t border-earth/10 bg-cream/30 py-12 sm:py-16" aria-labelledby="story-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="story-heading" className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            {t("aboutPage.storyTitle")}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
            {t("aboutPage.storyIntro")}
          </p>
          <ul className="mt-10 grid gap-8 lg:grid-cols-2">
            {storyImages.map((item) => (
              <li key={item.src} className="rounded-2xl border border-forest/15 bg-white p-4 shadow-sm">
                <img
                  src={item.src}
                  alt={t(item.altKey)}
                  className="h-56 w-full rounded-xl bg-cream/40 object-contain p-2 sm:h-64"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="mt-4 text-xl font-semibold text-forest">{t(item.titleKey)}</h3>
                <p className="mt-2 text-base leading-relaxed text-earth/90">{t(item.bodyKey)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-earth/10 bg-white py-12 sm:py-16" aria-labelledby="gallery-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="gallery-heading" className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            {t("aboutPage.gallery.title")}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
            {t("aboutPage.gallery.intro")}
          </p>
          <div className="mt-6 inline-flex rounded-xl border border-forest/20 bg-cream/40 p-1">
            <button
              type="button"
              onClick={() => setActiveGalleryTab("included")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeGalleryTab === "included"
                  ? "bg-forest text-cream"
                  : "text-earth hover:bg-forest/10 hover:text-forest"
              }`}
              aria-pressed={activeGalleryTab === "included"}
            >
              {t("aboutPage.gallery.tabIncluded")}
            </button>
            <button
              type="button"
              onClick={() => setActiveGalleryTab("extra")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeGalleryTab === "extra"
                  ? "bg-forest text-cream"
                  : "text-earth hover:bg-forest/10 hover:text-forest"
              }`}
              aria-pressed={activeGalleryTab === "extra"}
            >
              {t("aboutPage.gallery.tabExtra")}
            </button>
          </div>
          <ul className="mt-8 grid gap-8 lg:grid-cols-2">
            {(activeGalleryTab === "included" ? storyImages : additionalImages).map((item) => (
              <li key={item.src} className="rounded-2xl border border-forest/15 bg-cream/20 p-4 shadow-sm">
                <img
                  src={item.src}
                  alt={t(item.altKey)}
                  className="h-56 w-full rounded-xl bg-white object-contain p-2 sm:h-64"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="mt-4 text-xl font-semibold text-forest">{t(item.titleKey)}</h3>
                <p className="mt-2 text-base leading-relaxed text-earth/90">{t(item.bodyKey)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-earth/10 bg-white py-12 sm:py-16" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="timeline-heading" className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            Full Story Timeline
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
            The complete arc of Vijay Uttarwar's journey shown as a circular narrative: every milestone
            feeds the next and ultimately loops back to village impact.
          </p>
          <div className="relative mt-10 hidden min-h-[46rem] lg:block">
            <svg
              viewBox="0 0 900 900"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="story-circle-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(26 77 46)" />
                </marker>
              </defs>
              <circle cx="450" cy="450" r="230" fill="none" stroke="rgba(26, 77, 46, 0.2)" strokeWidth="3" />
              <path
                d="M 450 220 A 230 230 0 1 1 449.99 220"
                fill="none"
                stroke="rgba(26, 77, 46, 0.75)"
                strokeWidth="3"
                strokeDasharray="8 10"
                markerEnd="url(#story-circle-arrow)"
              />
            </svg>
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-forest/20 bg-cream/95 px-6 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-forest">
                Journey loops back to rural impact
              </p>
            </div>
            {timelineEvents.map((event, idx) => (
              <article
                key={event.title}
                className="absolute w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-forest/10 bg-cream/80 p-4 shadow-sm"
                style={{
                  left: `calc(50% + ${330 * Math.cos((event.angle * Math.PI) / 180)}px)`,
                  top: `calc(50% + ${330 * Math.sin((event.angle * Math.PI) / 180)}px)`,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ginger">
                  {event.phase} · Step {idx + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-forest">{event.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth/90">{event.detail}</p>
              </article>
            ))}
          </div>
          <ol className="mt-8 space-y-4 lg:hidden">
            {timelineEvents.map((event, idx) => (
              <li key={event.title} className="rounded-2xl border border-forest/10 bg-cream/30 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-ginger">
                  {event.phase} · Step {idx + 1}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-forest">{event.title}</h3>
                <p className="mt-2 leading-relaxed text-earth/90">{event.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-earth/10 bg-cream/30 py-12 sm:py-16" aria-labelledby="impact-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="impact-heading" className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">
            Impact of the Journey
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
            This story is not only about one founder. It shows how a successful business journey can
            create value for many groups and then return that value to the village ecosystem.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {impactGroups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-forest">{group.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-earth/90">
                  {group.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
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
