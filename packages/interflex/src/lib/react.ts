export type I18nKey = string;

export const useI18n = () => {
  const t = (key: I18nKey) => {
    return key;
  };

  return {
    t,
  };
};
