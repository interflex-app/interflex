#! /usr/bin/env node

import path from "path";
import { configSchema } from "interflex-core";
import { error } from "./cli";
import jitiFactory from "jiti";
import { transform } from "sucrase";

const main = async () => {
  const configFilePath = path.resolve(process.cwd(), "interflex.config.ts");

  const configRaw = jitiFactory(process.argv[1], {
    interopDefault: true,
    transform: (opts) => {
      return transform(opts.source, {
        transforms: ["typescript", "imports"],
      });
    },
  })(configFilePath);

  const config = configSchema.safeParse(configRaw);

  if (!config.success) {
    return error("Could not parse the config file.");
  }

  console.log(config.data);
};

await main();
