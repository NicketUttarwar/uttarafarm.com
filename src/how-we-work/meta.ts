import type { Locale } from "../contexts/LanguageContext";
import copyEn from "./copy.en.json";
import copyMr from "./copy.mr.json";

/** `/how-we-work` document `<title>` and meta description — lives next to localized copy files. */
export function howWeWorkDocumentMeta(locale: Locale) {
  return locale === "mr" ? copyMr.meta : copyEn.meta;
}
