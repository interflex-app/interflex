import { type Translation } from "@prisma/client";
import { type SupportedLanguage } from "../consts";

export const extractTranslations = (
  translationValue: Translation["value"]
): { language: SupportedLanguage; value: string }[] => {
  return Object.entries(translationValue ?? {}).map(([key, value]) => ({
    language: key as SupportedLanguage,
    value: String(value),
  }));
};
