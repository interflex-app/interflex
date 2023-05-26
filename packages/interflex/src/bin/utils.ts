import path from "path";
import jitiFactory from "jiti";
import { transform } from "sucrase";
import { error } from "./cli.js";
import { Command } from "commander";
import { z } from "zod";
import { JITIOptions } from "jiti/dist/types.js";
import { configSchema } from "../shared/config.js";
import fs from "fs";
import {
  APP_DATA_PATH,
  HEADER_TITLE,
  PROJECT_NAME,
  SERVICE_NAME,
} from "./consts.js";
import { Entry } from "@napi-rs/keyring";
import gradient from "gradient-string";

const poimandresTheme = {
  blue: "#add7ff",
  cyan: "#89ddff",
  green: "#5de4c7",
  magenta: "#fae4fc",
  red: "#d0679d",
  yellow: "#fffac2",
};

export const keyringEntry = new Entry(SERVICE_NAME, PROJECT_NAME);

export const readModule = (filePath: string): string => {
  try {
    //@ts-expect-error
    const jiti = jitiFactory(process.argv[1], {
      interopDefault: true,
      transform: (opts: JITIOptions["transformOptions"]) => {
        return transform(opts?.source, {
          transforms: ["typescript", "imports"],
        });
      },
    });

    return jiti(filePath);
  } catch (e) {
    error("Could not find the config file. Make sure it exists.");
    throw new Error();
  }
};

export const readConfig = async () => {
  const configFilePath = path.resolve(process.cwd(), "interflex.config.ts");
  const configRaw = readModule(configFilePath);

  const configParse = configSchema.safeParse(configRaw);
  if (!configParse.success) {
    error("Could not parse the config file.");
    throw new Error();
  }

  return configParse.data;
};

export const getCommand = () => {
  const program = new Command()
    .name("Interflex")
    .description("Interflex CLI for managing your Interflex project.")
    .argument(
      "<command>",
      "Command to run. Can be 'live', 'sync', 'gen', 'login' or 'link'."
    );

  if (!process.argv[2]) {
    return program.help();
  }

  program.parse(process.argv);

  const commandParse = z
    .enum(["live", "sync", "gen", "login", "link"])
    .safeParse(program.args[0]);

  if (!commandParse.success) {
    return program.help();
  }

  return commandParse.data;
};

const systemConfigSchema = z.object({
  projects: z.array(z.object({ path: z.string(), id: z.string() })),
});

export const readSystemConfig = () => {
  if (!fs.existsSync(APP_DATA_PATH)) {
    fs.mkdirSync(APP_DATA_PATH, { recursive: true });
  }

  const configPath = `${APP_DATA_PATH}/config.json`;
  const currentConfigRaw = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath).toString())
    : { projects: [] };

  const currentConfig = systemConfigSchema.safeParse(currentConfigRaw);

  let configData: z.infer<typeof systemConfigSchema> = { projects: [] };

  if (!currentConfig.success) {
    fs.writeFileSync(configPath, JSON.stringify({ projects: [] }));
    configData = { projects: [] };
  } else {
    configData = currentConfig.data;
  }

  return configData;
};

export const writeSystemConfig = (
  config: z.infer<typeof systemConfigSchema>
) => {
  if (!fs.existsSync(APP_DATA_PATH)) {
    fs.mkdirSync(APP_DATA_PATH, { recursive: true });
  }

  const configPath = `${APP_DATA_PATH}/config.json`;

  fs.writeFileSync(configPath, JSON.stringify(config));
};

export const checkAuth = ():
  | { authed: false; token: null }
  | { authed: true; token: string } => {
  const token = keyringEntry.getPassword();

  if (!token) {
    error(
      "You are not signed in. Use the `npx interflex login` command first."
    );

    return { token: null, authed: false };
  }

  return { token, authed: true };
};

export const logHeader = () => {
  const gradientMode = gradient(Object.values(poimandresTheme));
  console.log(gradientMode.multiline(HEADER_TITLE));
};
