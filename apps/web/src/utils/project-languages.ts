import { Prisma } from "@prisma/client";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "../consts";

export const projectLanguages = (languages: Prisma.JsonValue) =>
  (languages as SupportedLanguage[]).map(
    (lang) =>
      SUPPORTED_LANGUAGES.find((l) => l.value === lang) || {
        label: "Unknown",
        value: SupportedLanguage.English,
      }
  );
