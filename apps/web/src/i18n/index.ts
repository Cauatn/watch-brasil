import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ptBR from "./locales/pt-BR";

const STORAGE_KEY = "wb_locale";

export type AppLocale = "pt-BR" | "en";

function readStoredLocale(): AppLocale {
  if (typeof localStorage === "undefined") return "pt-BR";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "en" || raw === "pt-BR") return raw;
  return "pt-BR";
}

export function persistLocale(locale: AppLocale) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale(),
  fallbackLocale: "pt-BR",
  messages: {
    "pt-BR": ptBR,
    en,
  },
});
