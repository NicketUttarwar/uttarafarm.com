import { useLanguage } from "../contexts/LanguageContext";

const WHATSAPP_DIGITS = "918356070425";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_DIGITS}`;

export function Contact() {
  const { t } = useLanguage();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="rounded-3xl border border-forest/10 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-ginger">{t("contactPage.badge")}</p>
        <h1 className="mt-2 text-3xl font-bold text-forest sm:text-4xl">{t("contactPage.title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-earth/90">
          {t("contactPage.lead")}
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-forest/10 bg-cream/40 p-6 sm:p-8">
        <dl className="space-y-5">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">{t("contactPage.primaryContactLabel")}</dt>
            <dd className="mt-1 text-xl font-semibold text-forest">{t("contact.personName")}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">{t("contact.emailLabel")}</dt>
            <dd className="mt-1">
              <a className="font-medium text-forest underline" href="mailto:vijay@uttarwar.com">
                {t("contact.emailValue")}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-ginger">{t("contact.whatsappLabel")}</dt>
            <dd className="mt-1">
              <a
                className="font-medium text-forest underline"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contact.phoneValue")}
              </a>
              <p className="mt-1 text-sm text-earth/80">{t("contact.phoneNote")}</p>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
