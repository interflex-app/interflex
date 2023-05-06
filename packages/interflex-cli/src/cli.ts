export const error = (message: string) => {
  console.error(`[ERROR]: ${message}`);

  process.exit(1);
};

export const warning = (message: string) => {
  console.error(`[WARN]: ${message}`);

  process.exit(1);
};
