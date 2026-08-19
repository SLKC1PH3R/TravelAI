import type { Locale } from "@/lib/i18n/config";
import fr, { type Dictionary } from "./fr";
import en from "./en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr;
}
