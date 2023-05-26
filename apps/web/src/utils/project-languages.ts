import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@interflex-app/shared";
import { type Prisma } from "@prisma/client";

export const projectLanguages = (languages: Prisma.JsonValue) =>
  (languages as SupportedLanguage[]).map(
    (lang) =>
      SUPPORTED_LANGUAGES.find((l) => l.value === lang) || {
        label: "Unknown",
        value: SupportedLanguage.English,
      }
  );
