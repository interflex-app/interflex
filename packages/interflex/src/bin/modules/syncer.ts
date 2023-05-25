import { error } from "console";
import { warning } from "../cli.js";
import { keyringEntry, readConfig, readSystemConfig } from "../utils.js";
import ora from "ora";
import { getTranslations } from "../api.js";
import { LanguageTranslations, Translations } from "../../shared/types.js";
import path from "path";
import fs from "fs";

export const sync = async () => {
  const token = keyringEntry.getPassword();

  if (!token) {
    return error(
      "You are not signed in. Use the `npx interflex login` command first."
    );
  }

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
  const translations = await getTranslations(token, projectId);

  if (!translations || translations.length === 0) {
    spinner.fail("There are no translations in your project.");

    process.exit(1);
  }

  const result: Translations = {};

  translations.forEach(({ key, value }) => {
    const keys = key.split(".");
    const languages = Object.keys(value);

    languages.forEach((language) => {
      let obj = result[language] || {};
      let nestedObj = obj;

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];

        if (i === keys.length - 1) {
          nestedObj[currentKey] = value[language];
        } else {
          nestedObj[currentKey] = nestedObj[currentKey] || {};
          nestedObj = nestedObj[currentKey] as LanguageTranslations;
        }
      }

      result[language] = obj;
    });
  });

  const json = JSON.stringify(result, null, 2);

  const i18nPath = path.join(process.cwd(), config.directory!);

  if (!fs.existsSync(i18nPath)) {
    fs.mkdirSync(i18nPath, { recursive: true });
  }

  fs.writeFileSync(path.join(i18nPath, "translations.json"), json);

  spinner.succeed("Generated translation files.");
};
