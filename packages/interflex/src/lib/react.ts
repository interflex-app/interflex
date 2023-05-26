export type I18nKey = string;

export const generateInterflexClient = <Key extends string, Vars>() => {
  const useI18n = () => {
    const t = (key: Key) => {
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
