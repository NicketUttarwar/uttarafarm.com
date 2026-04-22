import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { assetUrl } from "../lib/assets";

const brandImages = [
  {
    src: assetUrl("naturell.svg"),
    captionKey: "aboutPage.captionNaturell" as const,
  },
  {
    src: assetUrl("max-protein.svg"),
    captionKey: "aboutPage.captionMax" as const,
  },
  {
    src: assetUrl("zydus-wellness.svg"),
    captionKey: "aboutPage.captionZydus" as const,
  },
];

export function About() {
  const { t } = useLanguage();

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

      <section
        className="border-t border-earth/10 bg-white py-12 sm:py-16"
        aria-labelledby="brands-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2
            id="brands-heading"
            className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
          >
            {t("aboutPage.brandsTitle")}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
            {t("aboutPage.brandsIntro")}
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {brandImages.map((item) => (
              <li key={item.src}>
                <figure className="overflow-hidden rounded-2xl border border-forest/15 bg-cream shadow-sm">
                  <img
                    src={item.src}
                    alt=""
                    className="h-auto w-full object-cover"
                    width={320}
                    height={120}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="border-t border-forest/10 px-4 py-3 text-center text-sm font-medium text-earth">
                    {t(item.captionKey)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
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
