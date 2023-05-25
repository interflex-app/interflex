import { useRouter } from "next/router";
import { z, type ZodRawShape } from "zod";

export const useQueryParams = <T extends ZodRawShape>(paramShape: T) => {
  const router = useRouter();

  const paramSchema = z.object(paramShape).deepPartial();
  const schemaParseResult = paramSchema.safeParse(router.query);

  return (schemaParseResult.success ? schemaParseResult.data : {}) as z.infer<
    typeof paramSchema
  >;
};
