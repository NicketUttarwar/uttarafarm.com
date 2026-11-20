import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useLanguage, type Locale } from "../contexts/LanguageContext";
import { hydrateTemplate } from "./hydrate";
import { useEightBInit } from "./useEightBInit";
import template from "./template.html?raw";
import copyEn from "./copy.en.json";
import copyMr from "./copy.mr.json";
import "../styles/eightb.css";

const copies: Record<Locale, Record<string, string>> = {
  en: copyEn,
  mr: copyMr,
};

export function EightBHome() {
  const { locale, setLocale } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const html = useMemo(
    () => hydrateTemplate(template, copies[locale]),
    [locale],
  );

  useEightBInit(rootRef, locale);

  useEffect(() => {
    document.documentElement.classList.add("eightb-page");
    return () => document.documentElement.classList.remove("eightb-page");
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLButtonElement>("[data-set-locale]").forEach((btn) => {
      const next = btn.dataset.setLocale as Locale | undefined;
      btn.setAttribute("aria-pressed", String(next === locale));
    });

    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest?.("[data-set-locale]");
      if (!btn) return;
      const next = (btn as HTMLElement).dataset.setLocale as Locale | undefined;
      if (next === "en" || next === "mr") setLocale(next);
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [locale, setLocale]);

  return (
    <div
      key={locale}
      ref={rootRef}
      className="eightb-root"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
