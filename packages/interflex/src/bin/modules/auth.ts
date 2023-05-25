import { Entry } from "@napi-rs/keyring";
import { warning } from "../cli.js";
import { CLI_AUTH_URL, PROJECT_NAME, SERVICE_NAME } from "../consts.js";
import { createAuthSession, getProjects, getSession } from "../api.js";
import open from "open";
import ora from "ora";
import { error } from "console";
import select, { Separator } from "@inquirer/select";

const entry = new Entry(SERVICE_NAME, PROJECT_NAME);

export const login = async () => {
  const spinner = ora("Signing in...").start();

  const session = await createAuthSession();

  await open(`${CLI_AUTH_URL}?sessionId=${session.id}`);

  let token = null;

  while (!token) {
    const newSession = await getSession(session.id);

    if (newSession?.token) {
      token = newSession.token;
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  entry.setPassword(token);

  spinner.succeed("Signed in. You can now use the CLI.");
};

export const link = async () => {
  const token = entry.getPassword();

  if (!token) {
    return error(
      "You are not signed in. Use the `npx interflex login` command first."
    );
  }

  const spinner = ora("Loading projects...").start();
  const teamsWithProjects = await getProjects(token);
  spinner.stop();

  if (teamsWithProjects.length === 0) {
    return warning("You have no projects.");
  }

  const projectId = await select({
    message: "Select a project to link:",
    choices: [
      ...teamsWithProjects.flatMap((team) => [
        new Separator(team.name),
        ...team.projects.map((project) => ({
          name: project.name,
          value: project.id,
        })),
      ]),
    ],
  });
};
