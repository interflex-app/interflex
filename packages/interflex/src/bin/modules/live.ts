import { warning } from "../cli.js";
import { readConfig } from "../utils.js";
import { sync } from "./syncer.js";

export const runLive = async () => {
  const config = await readConfig();

  warning("Not implemented yet. Using `sync` command instead.", false);

  await sync();
};
