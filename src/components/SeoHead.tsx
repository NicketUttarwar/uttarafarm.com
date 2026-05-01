import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { howWeWorkDocumentMeta } from "../how-we-work";

const SITE_URL = "https://uttarafarm.com";
const META_KEY_BY_PATH: Record<string, { titleKey: string; descriptionKey: string }> = {
  "/": {
    titleKey: "meta.home.title",
    descriptionKey: "meta.home.description",
  },
  "/story": {
    titleKey: "meta.about.title",
    descriptionKey: "meta.about.description",
  },
  "/timeline": {
    titleKey: "meta.about.title",
    descriptionKey: "meta.about.description",
  },
  "/impact": {
    titleKey: "meta.about.title",
    descriptionKey: "meta.about.description",
  },
  "/contact": {
    titleKey: "meta.contact.title",
    descriptionKey: "meta.contact.description",
  },
};

function upsertMeta(
  select: () => HTMLMetaElement | null,
  create: () => HTMLMetaElement,
  setContent: (el: HTMLMetaElement) => void,
) {
  let el = select();
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  setContent(el);
}

export function SeoHead() {
  const { pathname } = useLocation();
  const { locale, t } = useLanguage();

  useEffect(() => {
    const meta =
      pathname === "/how-we-work"
        ? howWeWorkDocumentMeta(locale)
        : (() => {
            const keyMeta = META_KEY_BY_PATH[pathname];
            if (!keyMeta) {
              return {
                title: t("brand"),
                description: t("meta.home.description"),
              };
            }
            return {
              title: t(keyMeta.titleKey),
              description: t(keyMeta.descriptionKey),
            };
          })();
    const title = meta.title;
    const description = meta.description;
    const path = pathname === "/" ? "" : pathname;
    const canonicalUrl = `${SITE_URL.replace(/\/$/, "")}${path || "/"}`;

    document.title = title;

    upsertMeta(
      () => document.querySelector('meta[name="description"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      },
      (el) => el.setAttribute("content", description),
    );

    upsertMeta(
      () => document.querySelector('meta[property="og:title"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      },
      (el) => el.setAttribute("content", title),
    );

    upsertMeta(
      () => document.querySelector('meta[property="og:description"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      },
      (el) => el.setAttribute("content", description),
    );

    upsertMeta(
      () => document.querySelector('meta[property="og:url"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:url");
        return m;
      },
      (el) => el.setAttribute("content", canonicalUrl),
    );

    upsertMeta(
      () => document.querySelector('meta[property="og:type"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:type");
        return m;
      },
      (el) => el.setAttribute("content", "website"),
    );

    upsertMeta(
      () => document.querySelector('meta[property="og:locale"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:locale");
        return m;
      },
      (el) => el.setAttribute("content", locale === "mr" ? "mr_IN" : "en_IN"),
    );

    upsertMeta(
      () => document.querySelector('meta[name="twitter:card"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:card");
        return m;
      },
      (el) => el.setAttribute("content", "summary_large_image"),
    );

    upsertMeta(
      () => document.querySelector('meta[name="twitter:title"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:title");
        return m;
      },
      (el) => el.setAttribute("content", title),
    );

    upsertMeta(
      () => document.querySelector('meta[name="twitter:description"]'),
      () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      },
      (el) => el.setAttribute("content", description),
    );
  }, [pathname, locale, t]);

  return null;
}
