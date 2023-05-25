import { error } from "console";
import { warning } from "../cli.js";
import { keyringEntry, readConfig, readSystemConfig } from "../utils.js";
import ora from "ora";
import { getTranslations } from "../api.js";

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

  const spinner = ora("Loading translations...").start();

  const translations = await getTranslations(token, projectId);
  console.log(translations);

  spinner.stop();
};
