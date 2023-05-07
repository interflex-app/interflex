#! /usr/bin/env node

import { link, login } from "./modules/auth.js";
import { generateTypes } from "./modules/generator.js";
import { sync } from "./modules/syncer.js";
import { runLive } from "./modules/live.js";
import { getCommand, readConfig } from "./utils.js";

const main = async () => {
  const command = getCommand();
  const config = await readConfig();

  switch (command) {
    case "live":
      await runLive(config);
      break;
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
