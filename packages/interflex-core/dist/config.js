import { z } from "zod";
export const configSchema = z.object({
    directory: z.string().optional(),
});
export const defineConfig = (config) => {
    if (!config.directory) {
        config.directory = "i18n";
    }
    return config;
};
