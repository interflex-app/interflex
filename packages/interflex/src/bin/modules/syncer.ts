import { warning } from "../cli.js";
import { readConfig } from "../utils.js";

export const sync = async () => {
  const config = await readConfig();

  warning("Not implemented yet.");
};
