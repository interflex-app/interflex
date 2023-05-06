import path from "path";
import jitiFactory from "jiti";
import { transform } from "sucrase";
import { configSchema } from "interflex-core";
import { error } from "./cli.js";
import { Command } from "commander";
import { z } from "zod";

export const readModule = (filePath: string): string => {
  const jiti = jitiFactory(process.argv[1], {
    interopDefault: true,
    transform: (opts) => {
      return transform(opts.source, {
        transforms: ["typescript", "imports"],
      });
    },
  });

  return jiti(filePath);
};

export const readConfig = async () => {
  const configFilePath = path.resolve(process.cwd(), "interflex.config.ts");
  const configRaw = readModule(configFilePath);

  const configParse = configSchema.safeParse(configRaw);
  if (!configParse.success) {
    return error("Could not parse the config file.");
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
