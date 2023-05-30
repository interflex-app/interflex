import { SupportedLanguage } from "interflex-internal";
import { Translations } from "../shared/types.js";
import { VariableTsType } from "./index.js";
import { NextConfig, type NextComponentType } from "next";
import { PropsWithChildren, createContext, useContext } from "react";
import { NextRouter, useRouter } from "next/router.js";
import { AppPropsType } from "next/dist/shared/lib/utils.js";
import { headers } from "next/headers.js";

const __internal_t = <
  Tra extends Translations,
  Key extends string,
  Lang extends `${SupportedLanguage}`,
  Vars extends {
    [varName: string]: VariableTsType;
  }
>(
  translations: Tra,
  key: Key,
  locale: Lang,
  variables: Vars | undefined
) => {
  let translation = key
    .split(".")
    .reduce(
      (acc, cur) => (acc?.[cur as keyof typeof acc] as string) ?? key,
      translations[locale] as Translations<Lang>[Lang] | string
    )
    ?.toString();

  Object.entries(variables || {}).forEach(([varName, varValue]) => {
    const value = varValue as VariableTsType;

    let realVal = "";

    if (typeof value === "string") {
      realVal = value;
    } else if (typeof value === "number") {
      realVal = value.toString();
    } else if (typeof value === "object") {
      realVal = (value as Date).toLocaleDateString(locale);
    }

    translation = translation?.replace(`{${varName}}`, realVal);
  });

  return translation || key;
};

export const nextInterflexConfigFactory =
  (locales: SupportedLanguage[], defaultLocale: SupportedLanguage) =>
  (nextConfig: NextConfig) => ({
    ...nextConfig,
    i18n: {
      ...nextConfig.i18n,
      locales,
      defaultLocale,
    },
  });

interface InterflexClientInterface<Lang extends `${SupportedLanguage}`> {
  locale: Lang;
  onChangeLocale: (locale: Lang) => Promise<void>;
}

const createInterflexContext = <Lang extends `${SupportedLanguage}`>() =>
  createContext({} as InterflexClientInterface<Lang>);

export type InterflexClientOptions<Lang extends `${SupportedLanguage}`> = {
  defaultLocale: Lang;
};

export const generateInterflexClient = <
  Keys extends string,
  Vars extends {
    [key in Keys]?: {
      [varName: string]: VariableTsType;
    };
  },
  Lang extends `${SupportedLanguage}`
>(
  translations: Translations<Lang>,
  options: InterflexClientOptions<Lang>
) => {
  const InterflexContext = createInterflexContext<Lang>();

  const InterflexProvider: React.FC<
    PropsWithChildren<{
      locale: Lang;
      onChangeLocale: (newLocale: Lang) => Promise<void>;
    }>
  > = ({ children, locale, onChangeLocale }) => {
    return (
      <InterflexContext.Provider value={{ locale, onChangeLocale }}>
        {children}
      </InterflexContext.Provider>
    );
  };

  const useI18n = () => {
    const interflexContext = useContext(InterflexContext);

    if (!interflexContext) {
      throw new Error(
        "You have to use the `withInterflex` function on your app component!"
      );
    }

    const { locale, onChangeLocale } = interflexContext;

    const t = <Key extends Keys>(
      key: Key,
      ...vars: Vars[Key] extends object ? [Vars[Key]] : []
    ) => {
      const variables = vars[0];

      return __internal_t(translations, key, locale, variables);
    };

    const changeLocale = async (locale: Lang) => {
      await onChangeLocale(locale);
    };

    return {
      t,
      locale,
      changeLocale,
    };
  };

  const withInterflex = (appOrPage: NextComponentType<any, any, any>) => {
    const AppOrPage = appOrPage;

    const WithInterflex = (props: AppPropsType<NextRouter, any>) => {
      const router = useRouter();

      return (
        <InterflexProvider
          locale={(router.locale as Lang | undefined) || options.defaultLocale}
          onChangeLocale={async (newLocale) => {
            await router.push(router.asPath, router.asPath, {
              locale: newLocale,
            });
          }}
        >
          <AppOrPage {...props} />
        </InterflexProvider>
      );
    };

    return WithInterflex;
  };

  return {
    useI18n,
    withInterflex,
    InterflexProvider,
  };
};

export const generateInterflexUtils = <
  Keys extends string,
  Vars extends {
    [key in Keys]?: {
      [varName: string]: VariableTsType;
    };
  },
  Lang extends `${SupportedLanguage}`
>(
  translations: Translations<Lang>,
  options: InterflexClientOptions<Lang>
) => {
  const i18n = () => {
    const header = headers();
    const locale = header.get("test");

    const t = <Key extends Keys>(
      key: Key,
      ...vars: Vars[Key] extends object ? [Vars[Key]] : []
    ) => {
      const variables = vars[0];

      return __internal_t(translations, key, locale as Lang, variables);
    };

    return {
      t,
    };
  };

  return {
    i18n,
  };
};
