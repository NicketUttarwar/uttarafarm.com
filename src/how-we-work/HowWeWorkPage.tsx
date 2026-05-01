import layoutRaw from "./layout.json";
import copyEn from "./copy.en.json";
import copyMr from "./copy.mr.json";
import { CircularProcessDiagram, type CircularProcessCopy, type LayoutSpec } from "./CircularProcessDiagram";
import { useLanguage } from "../contexts/LanguageContext";

const layout = {
  ...layoutRaw,
  center: layoutRaw.center as [number, number],
} as LayoutSpec;

export function HowWeWork() {
  const { locale } = useLanguage();
  const copy = locale === "mr" ? copyMr : copyEn;

  const diagramCopy: CircularProcessCopy = {
    centerLine1: copy.centerLine1,
    centerLine2: copy.centerLine2,
    entryLabel: copy.entryLabel,
    loopLine1: copy.loopLine1,
    loopLine2: copy.loopLine2,
    steps: copy.steps,
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="rounded-3xl border border-forest/10 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-ginger">{copy.badge}</p>
        <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">{copy.lead}</p>
      </header>

      <section className="mt-8 overflow-visible rounded-2xl border border-forest/10 bg-white p-4 shadow-sm sm:p-6">
        <div className="overflow-visible rounded-xl bg-cream/40 p-2 sm:p-5">
          <CircularProcessDiagram layout={layout} copy={diagramCopy} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-earth/80">{copy.footnote}</p>
      </section>
    </article>
  );
}
