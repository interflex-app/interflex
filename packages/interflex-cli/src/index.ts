#! /usr/bin/env node

import { link, login } from "./auth.js";
import { generateTypes } from "./generator.js";
import { sync } from "./syncer.js";
import { getCommand, readConfig } from "./utils.js";

const main = async () => {
  const command = getCommand();
  const config = await readConfig();

  switch (command) {
    case "sync":
      await sync(config);
      break;
    case "gen":
      await generateTypes(config);
      break;
    case "login":
      await login(config);
      break;
    case "link":
      await link(config);
      break;
  }
};

await main();
