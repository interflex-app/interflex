#! /usr/bin/env node
import { readConfig } from "./utils.js";

const main = async () => {
  const config = await readConfig();
};

await main();
