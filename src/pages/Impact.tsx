const groups = [
  {
    title: "Employees",
    points: [
      "Broad-based ESOP participation included team members across roles.",
      "Acquisition terms focused on continuity and long-term opportunity.",
      "Financial outcomes were designed to reward contribution, not just title.",
    ],
  },
  {
    title: "Investors and Shareholders",
    points: [
      "Capital partners received meaningful returns on risk capital.",
      "Founder-shareholder outcomes aligned with sustained brand growth.",
      "Deal structure balanced upside with business continuity.",
    ],
  },
  {
    title: "Strategic Acquirer (Zydus Wellness)",
    points: [
      "Acquired established nutrition brands with proven demand.",
      "Added a growth-ready team and product innovation engine.",
      "Strengthened leadership position in wellness-led snacking.",
    ],
  },
  {
    title: "Ecosystem Partners",
    points: [
      "Distributors and vendor partners gained expansion potential.",
      "Scaling platform created a larger downstream opportunity surface.",
      "Brand continuity reduced disruption risk across the network.",
    ],
  },
] as const;

export function Impact() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="rounded-3xl border border-forest/10 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-ginger">Win-Win Thesis</p>
        <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">
          Who Benefited and Why
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/90">
          A recurring theme in the transcript is stakeholder balance. This section captures the
          four major beneficiary groups discussed in the acquisition narrative.
        </p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title} className="rounded-2xl border border-forest/10 bg-cream/40 p-6">
            <h2 className="text-xl font-semibold text-forest">{group.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-earth/90">
              {group.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
