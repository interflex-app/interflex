#! /usr/bin/env node

import path from "path";
import { configSchema } from "interflex-core";
import { error } from "./cli";
import jitiFactory from "jiti";
import { transform } from "sucrase";

const readConfig = async () => {
  const configFilePath = path.resolve(process.cwd(), "interflex.config.ts");

  const configRaw = jitiFactory(process.argv[1], {
    interopDefault: true,
    transform: (opts) => {
      return transform(opts.source, {
        transforms: ["typescript", "imports"],
      });
    },
  })(configFilePath);

  const configParse = configSchema.safeParse(configRaw);

  if (!configParse.success) {
    return error("Could not parse the config file.");
  }

  return configParse.data;
};

const main = async () => {
  const config = await readConfig();
};

await main();
