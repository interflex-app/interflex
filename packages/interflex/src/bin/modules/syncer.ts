import { error } from "console";
import { warning } from "../cli.js";
import {
  checkAuth,
  keyringEntry,
  readConfig,
  readSystemConfig,
} from "../utils.js";
import ora from "ora";
import { getTranslationsWithProject } from "../api.js";
import { Translation, Translations } from "../../shared/types.js";
import path from "path";
import fs from "fs";
import { SupportedLanguage, VariableType } from "interflex-internal";
import { INTERFLEX_TS_FILE, NEXT_INTERFLEX_CONFIG_JS_FILE } from "../consts.js";

export const sync = async () => {
  const { authed, token } = checkAuth();
  if (!authed) return;

  const config = await readConfig();
  const systemConfig = readSystemConfig();

  const projectId = systemConfig.projects.find(
    (project) => project.path === process.cwd()
  )?.id;

  if (!projectId) {
    return error(
      "Could not find lnked project. Use `npx interflex link` first."
    );
  }

  const spinner = ora("Generating translation files...").start();
  const { translations, project } = await getTranslationsWithProject(
    token,
    projectId
  );

  if (!translations || translations.length === 0) {
    spinner.fail("There are no translations in your project.");

    process.exit(1);
  }

  const result: Translations = {};

  translations.forEach(({ key, value }) => {
    const keys = key.split(".");
    const languages = Object.keys(value);

    languages
      .filter((lang) => project.languages.includes(lang as SupportedLanguage))
      .forEach((language) => {
        let obj = result[language as SupportedLanguage] || {};
        let nestedObj = obj;

        for (let i = 0; i < keys.length; i++) {
          const currentKey = keys[i];

          if (i === keys.length - 1) {
            nestedObj[currentKey] = value[language];
          } else {
            nestedObj[currentKey] = nestedObj[currentKey] || {};
            nestedObj = nestedObj[currentKey] as Translation;
          }
        }

        result[language as SupportedLanguage] = obj;
      });
  });

  const getVarType = (type: VariableType) => {
    switch (type) {
      case VariableType.STRING:
        return "string";
      case VariableType.NUMBER:
        return "number";
      case VariableType.DATE:
        return "Date";
    }
  };

  const variables = translations
    .filter((t) => !!t.variables)
    .map(({ variables, key }) => {
      const vars = variables!
        .map((v) => `${v.name}: ${getVarType(v.type)}`)
        .join(", ");

      return !!vars ? `  "${key}": { ${vars} }` : null;
    })
    .filter((v) => !!v)
    .join(";\n");

  const json = JSON.stringify(result, null, 2);

  const i18nPath = path.join(process.cwd(), config.directory!);

  if (!fs.existsSync(i18nPath)) {
    fs.mkdirSync(i18nPath, { recursive: true });
  }

  fs.writeFileSync(path.join(i18nPath, "translations.json"), json);
  fs.writeFileSync(
    path.join(i18nPath, "interflex.ts"),
    INTERFLEX_TS_FILE(variables, project.languages[0])
  );
  fs.writeFileSync(
    path.join(i18nPath, "next-interflex-config.mjs"),
    NEXT_INTERFLEX_CONFIG_JS_FILE(
      project.languages.map((l) => `"${l}"`).join(", "),
      project.languages[0]
    )
  );

  spinner.succeed("Generated translation files.");
};
