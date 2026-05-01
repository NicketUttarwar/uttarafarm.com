const events = [
  {
    phase: "Act 1",
    title: "Village roots and a global career",
    detail:
      "Vijay’s upbringing in rural Maharashtra shaped his long-term desire to improve farm incomes, even after building a successful software career.",
  },
  {
    phase: "Act 1",
    title: "Naturell starts with Stevia",
    detail:
      "The original vision combined a healthier sugar alternative with farmer prosperity under the spirit of 'Healthy Urban, Wealthy Rural.'",
  },
  {
    phase: "Act 2",
    title: "Regulatory shock",
    detail:
      "Stevia faced an approval roadblock, creating a major setback after early team and resource investments.",
  },
  {
    phase: "Act 2",
    title: "Pivot to RiteBite nutrition bars",
    detail:
      "The company entered an underdeveloped category in India, testing product-market fit while learning the consumer business from scratch.",
  },
  {
    phase: "Act 2",
    title: "Pricing and positioning reset",
    detail:
      "Initial messaging as 'healthy chocolate for kids' underperformed. The team shifted to functional benefits and clearer audience segments.",
  },
  {
    phase: "Act 2",
    title: "Max Protein breakout",
    detail:
      "Gym-focused demand for affordable high-protein bars drove traction, leading to the creation and growth of the Max Protein line.",
  },
  {
    phase: "Act 2",
    title: "Innovation-led expansion",
    detail:
      "The business broadened into chips, cookies, granola, peanut butter, and newer protein formats, including millet-based concepts.",
  },
  {
    phase: "Act 3",
    title: "Scale milestone reached",
    detail:
      "Naturell grew into a large and recognized nutrition platform, proving strong product and brand resonance in India’s health snacking market.",
  },
  {
    phase: "Act 3",
    title: "Strategic partnership with Zydus",
    detail:
      "To pursue a significantly larger growth ambition, the company chose Zydus Wellness for scale capabilities and category-building experience.",
  },
  {
    phase: "Act 3",
    title: "People-first acquisition design",
    detail:
      "Employee continuity, ESOP outcomes, investor returns, and partner ecosystem stability were all treated as explicit priorities.",
  },
] as const;

export function Timeline() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-ginger">Chronology</p>
        <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">
          Full Timeline from the War Room Transcript
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
          This timeline is organized in the same sequence reflected in the transcript materials:
          origin, adversity, adaptation, product-market fit, and strategic scale.
        </p>
      </header>

      <ol className="mt-10 space-y-4">
        {events.map((event, idx) => (
          <li key={event.title} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ginger">
              {event.phase} · Step {idx + 1}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-forest">{event.title}</h2>
            <p className="mt-2 leading-relaxed text-earth/90">{event.detail}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
