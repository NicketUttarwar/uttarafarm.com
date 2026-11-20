import { useLanguage } from "../contexts/LanguageContext";
import { AmbientDecor } from "./AmbientDecor";
import { ParallaxField } from "./ParallaxField";
import { SpinMark } from "./SpinMark";

export function SectionRegion() {
  const { t } = useLanguage();

  return (
    <section
      id="region"
      className="relative scroll-mt-24 overflow-hidden border-b border-forest/10 bg-white py-16 sm:py-20"
      aria-labelledby="region-heading"
    >
      <ParallaxField variant="light" />
      <AmbientDecor variant="light" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div data-reveal data-depth data-speed="0.08">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ginger">
              <SpinMark tone="ginger" duration={22} className="text-xs" />
              {t("region.badge")}
            </p>
            <h2
              id="region-heading"
              className="mt-3 display-wordmark text-3xl text-forest sm:text-5xl"
            >
              {t("region.title")}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-earth/95">
              <p>{t("region.p1")}</p>
              <p>{t("region.p2")}</p>
            </div>
          </div>
          <div
            data-reveal
            data-depth
            data-speed="-0.1"
            className="overflow-hidden rounded-sm border border-forest/15 bg-paper shadow-sm will-change-transform"
          >
            <iframe
              title={t("region.mapTitle")}
              src="https://www.google.com/maps?q=Vidarbha%20Maharashtra&output=embed"
              className="aspect-[4/3] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
