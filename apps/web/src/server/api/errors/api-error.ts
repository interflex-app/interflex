import { ZodError } from "zod";

export class ApiError extends ZodError {
  constructor(message: string, field?: string) {
    super([
      { message, code: "custom", path: [field || "__NON_EXISTENT_FIELD__"] },
    ]);
  }
}
