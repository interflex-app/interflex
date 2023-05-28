// This file is auto-generated by Interflex.
// Do not edit this file.

import { InterflexKey } from "interflex";
import { generateInterflexClient } from "interflex/next";
import translations from "./translations.json";

type I18nKey = InterflexKey<typeof translations>;

type I18nVariables = {
  "title": { name: string };
  "showDate": { date: Date }
};

type I18nLanguage = keyof typeof translations;

const { useI18n, withInterflex } = generateInterflexClient<
  I18nKey,
  I18nVariables,
  I18nLanguage
>(translations, { defaultLocale: "en" });

export {
  useI18n,
  withInterflex,
  type I18nKey,
  type I18nVariables,
  type I18nLanguage,
};
