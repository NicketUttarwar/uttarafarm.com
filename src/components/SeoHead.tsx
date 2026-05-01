import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { howWeWorkDocumentMeta } from "../how-we-work";

const SITE_URL = "https://uttarafarm.com";
const META_BY_PATH: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Uttara Farm — From Village Farm to Brand Scale",
    description:
      "A refreshed multi-page story site documenting the full Naturell, RiteBite, Max Protein, and Zydus timeline.",
  },
  "/timeline": {
    title: "Timeline — Uttara Farm",
    description:
      "Chronological timeline of events from village roots to strategic acquisition, based on the war room transcript.",
  },
  "/story": {
    title: "Story — Nicket and Vijay Uttarwar",
    description:
      "Interview-style narrative covering pivots, product-market fit, innovation, and stakeholder-first scale decisions.",
  },
  "/impact": {
    title: "Impact — Uttara Farm",
    description:
      "How the journey created value for employees, investors, strategic partners, and the wider ecosystem.",
  },
  "/contact": {
    title: "Contact — Uttara Farm",
    description: "Reach out to Uttara Farm for collaboration, media, or strategic conversations.",
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
  const { locale } = useLanguage();

  useEffect(() => {
    const meta =
      pathname === "/how-we-work"
        ? howWeWorkDocumentMeta(locale)
        : (META_BY_PATH[pathname] ?? {
            title: "Uttara Farm",
            description: "Uttara Farm website",
          });
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
      (el) => el.setAttribute("content", "en_IN"),
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
  }, [pathname, locale]);

  return null;
}
