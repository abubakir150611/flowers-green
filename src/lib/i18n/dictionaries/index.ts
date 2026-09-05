import type { Locale } from "../config";
import ru from "./ru";
import kg from "./kg";
import type { Dictionary } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { ru, kg };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
