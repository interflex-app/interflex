import { z } from "zod";
export declare const configSchema: z.ZodObject<{
    directory: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    directory?: string | undefined;
}, {
    directory?: string | undefined;
}>;
export type InterflexConfig = z.infer<typeof configSchema>;
export declare const defineConfig: (config: InterflexConfig) => {
    directory?: string | undefined;
};
