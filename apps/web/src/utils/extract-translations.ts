import { type SupportedLanguage } from "@interflex-app/shared";
import { type Translation } from "@prisma/client";

export const extractTranslations = (
  translationValue: Translation["value"]
): { language: SupportedLanguage; value: string }[] => {
  return Object.entries(translationValue ?? {}).map(([key, value]) => ({
    language: key as SupportedLanguage,
    value: String(value),
  }));
};
