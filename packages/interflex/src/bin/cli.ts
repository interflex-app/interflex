import ora from "ora";

export const error = (message: string, exit = true) => {
  ora().fail(`[ERROR]: ${message}`);

  if (exit) process.exit(1);
};

export const warning = (message: string, exit = true) => {
  ora().warn(`[WARN]: ${message}`);

  if (exit) process.exit(1);
};
