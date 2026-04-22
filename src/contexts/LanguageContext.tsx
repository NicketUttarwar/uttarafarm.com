import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "../locales/en.json";
import mr from "../locales/mr.json";

export type Locale = "en" | "mr";

const STORAGE_KEY = "uttarafarm-locale";

const messages: Record<Locale, Record<string, unknown>> = { en, mr };

function getByPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[p];
  }
  return typeof current === "string" ? current : undefined;
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "mr" || stored === "en") return stored;
  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("mr")) return "mr";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "mr" ? "mr" : "en";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string) => {
      const raw = getByPath(messages[locale], key);
      if (raw !== undefined) return raw;
      const fallback = getByPath(messages.en, key);
      return fallback ?? key;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
