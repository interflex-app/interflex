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

export type SupportedLanguageType =
  (typeof SupportedLanguage)[keyof typeof SupportedLanguage];

export enum VariableType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
}

type VariableStringOptions = Record<string, never>;

type VariableNumberOptions = Record<string, never>;

type VariableDateOptions = Record<string, never>;

type VariableOptions = {
  STRING: VariableStringOptions;
  NUMBER: VariableNumberOptions;
  DATE: VariableDateOptions;
};

export type Variable<T extends VariableType = VariableType> = {
  name: string;
  type: T;
  options?: VariableOptions[T];
};
