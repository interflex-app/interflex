import { z } from "zod";

export const configSchema = z.object({
  directory: z.string().optional(),
});

export type InterflexConfig = z.infer<typeof configSchema>;

export const defineConfig = (config: InterflexConfig) => {
  if (!config.directory) {
    config.directory = "i18n";
  }

  return config;
};
