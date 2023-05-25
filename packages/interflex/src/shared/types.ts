export type Translation = {
  [key: string]: string | Translation;
};

export type LanguageTranslations = {
  [lang: string]: Translation;
};

export type Translations = {
  [lang: string]: LanguageTranslations;
};
