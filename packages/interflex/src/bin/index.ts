#! /usr/bin/env node

import { link, login } from "./modules/auth.js";
import { generateTypes } from "./modules/generator.js";
import { sync } from "./modules/syncer.js";
import { runLive } from "./modules/live.js";
import { getCommand, readConfig } from "./utils.js";

const main = async () => {
  const command = getCommand();

  switch (command) {
    case "live":
      await runLive();
      break;
    case "sync":
      await sync();
      break;
    case "gen":
      await generateTypes();
      break;
    case "login":
      await login();
      break;
    case "link":
      await link();
      break;
  }
};

await main();
