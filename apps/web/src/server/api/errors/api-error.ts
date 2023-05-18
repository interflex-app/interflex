import { ZodError } from "zod";

export class ApiError extends ZodError {
  constructor(message: string, field?: string | number | (string | number)[]) {
    super([
      {
        message,
        code: "custom",
        path: [
          ...((typeof field === "string" || typeof field === "number"
            ? [field]
            : field) || "__NON_EXISTENT_FIELD__"),
        ],
      },
    ]);
  }
}
