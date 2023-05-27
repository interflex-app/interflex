import { SupportedLanguage } from "interflex-internal";

export type Translation = {
  [key: string]: string | Translation;
};

export type LanguageTranslations = {
  [key: string]: Translation;
};

export type Translations<
  Langs extends `${SupportedLanguage}` = `${SupportedLanguage}`
> = {
  [lang in Langs]?: LanguageTranslations;
};
