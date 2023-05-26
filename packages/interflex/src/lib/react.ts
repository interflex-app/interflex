import { Translations } from "../shared/types.js";
import { VariableTsType } from "./index.js";

export type I18nKey = string;

export const generateInterflexClient = <
  Keys extends string,
  Vars extends {
    [key in Keys]?: {
      [varName: string]: VariableTsType;
    };
  }
>(
  translations: Translations
) => {
  const useI18n = () => {
    const t = <Key extends Keys>(
      key: Key,
      ...vars: Vars[Key] extends object ? [Vars[Key]] : []
    ) => {
      const variables = vars[0];

      return key;
    };

    return {
      t,
    };
  };

  return {
    useI18n,
  };
};
