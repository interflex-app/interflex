import { SupportedLanguage } from "@interflex-app/shared";

export type Translation = {
  [key: string]: string | Translation;
};

export type LanguageTranslations = {
  [key: string]: Translation;
};

export type Translations = {
  [lang in SupportedLanguage]?: LanguageTranslations;
};
