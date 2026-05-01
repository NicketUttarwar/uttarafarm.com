export function Contact() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="rounded-3xl border border-forest/10 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-ginger">Get in touch</p>
        <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">Contact Uttara Farm</h1>
        <p className="mt-4 text-lg leading-relaxed text-earth/90">
          For speaking requests, collaborations, media questions, or strategic conversations,
          reach out directly.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-forest/10 bg-cream/40 p-6 sm:p-8">
        <dl className="space-y-5">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">Primary Contact</dt>
            <dd className="mt-1 text-xl font-semibold text-forest">Vijay Uttarwar</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">Email</dt>
            <dd className="mt-1">
              <a className="font-medium text-forest underline" href="mailto:vijay@uttarwar.com">
                vijay@uttarwar.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">Phone</dt>
            <dd className="mt-1">
              <a className="font-medium text-forest underline" href="tel:+919821162605">
                +91 98211 62605
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
