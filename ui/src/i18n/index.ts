import { useEffect, useState } from "react";
import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import { DEFAULT_LOCALE, i18nextResources, supportedLocales } from "./locales";
import {
  detectUiLocale,
  loadCommonCatalog,
  LOCALE_STORAGE_KEY,
  subscribeLocale,
  type UiLocale,
  getUiLocale,
} from "./common-catalog";

export {
  detectUiLocale,
  getUiLocale,
  loadCommonCatalog,
  subscribeLocale,
  tc,
  useUiLocale,
  type UiLocale,
} from "./common-catalog";

const initialLocale = detectUiLocale();

const i18nextOptions: InitOptions = {
  resources: i18nextResources,
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnObjects: false,
  initAsync: false,
};

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

void loadCommonCatalog(initialLocale);
if (typeof document !== "undefined") {
  document.documentElement.lang = initialLocale;
}

export function t(key: string, options: TOptions = {}) {
  return i18n.t(key, options);
}

export async function setUiLocale(locale: UiLocale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
  document.documentElement.lang = locale;
  await Promise.all([i18n.changeLanguage(locale), loadCommonCatalog(locale)]);
}

export function useLocaleState() {
  const [locale, setLocale] = useState<UiLocale>(getUiLocale);
  useEffect(() => subscribeLocale(() => setLocale(getUiLocale())), []);
  return locale;
}

export const useTranslation = useReactI18nextTranslation;
export { i18n };
