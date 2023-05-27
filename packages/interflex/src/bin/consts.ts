import path from "path";

export const SERVICE_NAME = "interflex";
export const PROJECT_NAME = "interflex";

export const APP_URL =
  process.env.NODE_ENV === "test"
    ? "http://localhost:3000"
    : "https://interflex.dev";

export const CLI_AUTH_URL = APP_URL + "/auth/cli";

export const APP_DATA_PATH = path.join(
  process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : process.env.HOME + "/.local/share"),
  "interflex"
);

export const HEADER_TITLE = `
██╗███╗   ██╗████████╗███████╗██████╗ ███████╗██╗     ███████╗██╗  ██╗
██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██║     ██╔════╝╚██╗██╔╝
██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ██║     █████╗   ╚███╔╝ 
██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║     ██╔══╝   ██╔██╗ 
██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ███████╗███████╗██╔╝ ██╗
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝
`;

export const INTERFLEX_TS_FILE = (
  variables: string
) => `// This file is auto-generated by Interflex.
// Do not edit this file.

import { InterflexKey } from "interflex";
import { generateInterflexClient } from "interflex/react";
import translations from "./translations.json";

type I18nKey = InterflexKey<typeof translations>;

type I18nVariables = {
${variables}
};

type I18nLanguages = keyof typeof translations;

const { useI18n } = generateInterflexClient<I18nKey, I18nVariables, I18nLanguages>(translations);

export { useI18n };
`;
