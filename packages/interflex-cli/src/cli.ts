export const error = (message: string) => {
  console.error(`[ERROR]: ${message}`);

  process.exit(1);
};
