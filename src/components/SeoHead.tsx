import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const SITE_URL = "https://uttarafarm.com";

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
  const { locale, t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const metaPrefix = pathname.startsWith("/about") ? "meta.about" : "meta.home";
    const title = t(`${metaPrefix}.title`);
    const description = t(`${metaPrefix}.description`);
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
      (el) =>
        el.setAttribute("content", locale === "mr" ? "mr_IN" : "en_IN"),
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
  }, [locale, t, pathname]);

  return null;
}
