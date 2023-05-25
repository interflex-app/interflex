export const SERVICE_NAME = "interflex";
export const PROJECT_NAME = "interflex";

export const APP_URL =
  process.env.NODE_ENV === "production"
    ? "https://interflex.dev"
    : "http://localhost:3000";

export const CLI_AUTH_URL = APP_URL + "/auth/cli";
