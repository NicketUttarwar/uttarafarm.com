import { useLanguage } from "../contexts/LanguageContext";

/** Fallback if display string has no digits (should not happen). */
const PHONE_DIGITS_FALLBACK = "918356070425";

export function SectionContact() {
  const { t } = useLanguage();
  const email = t("contact.emailValue");
  const phoneDisplay = t("contact.phoneValue");
  const digits =
    phoneDisplay.replace(/\D/g, "") || PHONE_DIGITS_FALLBACK;
  const waUrl = `https://wa.me/${digits}`;

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-gradient-to-b from-cream to-ginger/5 py-16 sm:py-20"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="contact-heading"
          className="text-2xl font-bold tracking-tight text-forest sm:text-3xl"
        >
          {t("contact.title")}
        </h2>
        <p className="mt-2 text-lg font-semibold text-forest">{t("contact.personName")}</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-earth/95">
          {t("contact.intro")}
        </p>
        <dl className="mt-10 max-w-xl space-y-6">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">
              {t("contact.emailLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${email}`}
                className="text-lg font-medium text-forest underline decoration-ginger/40 underline-offset-4 hover:decoration-ginger"
              >
                {email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">
              {t("contact.whatsappLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-forest underline decoration-ginger/40 underline-offset-4 hover:decoration-ginger"
              >
                {phoneDisplay}
              </a>
              <p className="mt-1 text-sm text-earth/80">{t("contact.phoneNote")}</p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit font-semibold text-forest underline decoration-ginger/40 underline-offset-4 hover:decoration-ginger"
              >
                {t("contact.whatsappCta")}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
