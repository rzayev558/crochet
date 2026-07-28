/**
 * Lightweight i18n for Loop.
 *
 * No heavy dependency — just a keyed dictionary (./translations), a zustand
 * store for the chosen language, and a `t()` function with {placeholder}
 * interpolation. The user can force a language in Settings, or leave it on
 * "system" to follow the device locale.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo } from "react";
import { create } from "zustand";
import { de, en, type TranslationKey } from "./translations";

export type Lang = "en" | "de";
/** What the user picked: an explicit language, or "system" to auto-detect. */
export type LangPref = "system" | Lang;

const STORAGE_KEY = "loop.lang.v1";

const DICTS: Record<Lang, Record<TranslationKey, string>> = { en, de };

/** Best-effort device language via Intl (Hermes ships Intl). Defaults to English. */
export function detectDeviceLang(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? "";
    return locale.toLowerCase().startsWith("de") ? "de" : "en";
  } catch {
    return "en";
  }
}

function resolve(pref: LangPref): Lang {
  return pref === "system" ? detectDeviceLang() : pref;
}

type Params = Record<string, string | number>;

/** Translate a key in a specific language, filling in {placeholders}. */
export function translate(lang: Lang, key: TranslationKey, params?: Params): string {
  const template = DICTS[lang][key] ?? DICTS.en[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in params ? String(params[name]) : `{${name}}`
  );
}

type LanguageState = {
  ready: boolean;
  pref: LangPref;
  /** The resolved, active language — always "en" or "de". */
  lang: Lang;
  init: () => Promise<void>;
  setPref: (pref: LangPref) => Promise<void>;
};

export const useLanguage = create<LanguageState>()((set) => ({
  ready: false,
  pref: "system",
  lang: detectDeviceLang(),

  init: async () => {
    const stored = (await AsyncStorage.getItem(STORAGE_KEY)) as LangPref | null;
    const pref: LangPref = stored ?? "system";
    set({ ready: true, pref, lang: resolve(pref) });
  },

  setPref: async (pref) => {
    await AsyncStorage.setItem(STORAGE_KEY, pref);
    set({ pref, lang: resolve(pref) });
  },
}));

export type TFunc = (key: TranslationKey, params?: Params) => string;

/**
 * Hook returning a `t()` bound to the active language. Components re-render
 * automatically when the user switches languages.
 */
export function useT(): TFunc {
  const lang = useLanguage((s) => s.lang);
  return useMemo<TFunc>(() => (key, params) => translate(lang, key, params), [lang]);
}

/** Non-hook accessor for the active language (e.g. building default DB names). */
export function currentLang(): Lang {
  return useLanguage.getState().lang;
}

/** Non-hook `t()` for use outside React components. */
export function t(key: TranslationKey, params?: Params): string {
  return translate(currentLang(), key, params);
}
