export enum SupportedLanguage {
  Polish = "pl",
  English = "en",
  Norwegian = "no",
  Ukrainian = "ua",
}

export const SUPPORTED_LANGUAGES = [
  { label: "🇵🇱 Polski", value: SupportedLanguage.Polish },
  { label: "🇬🇧 English", value: SupportedLanguage.English },
  { label: "🇳🇴 Norsk", value: SupportedLanguage.Norwegian },
  { label: "🇺🇦 Українська", value: SupportedLanguage.Ukrainian },
];

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(
  (lang) => lang.value
);
