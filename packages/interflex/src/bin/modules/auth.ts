import { warning } from "../cli.js";
import { CLI_AUTH_URL } from "../consts.js";
import { createAuthSession, getProjects, getSession } from "../api.js";
import open from "open";
import ora from "ora";
import { error } from "../cli.js";
import select, { Separator } from "@inquirer/select";
import {
  checkAuth,
  keyringEntry,
  readSystemConfig,
  writeSystemConfig,
} from "../utils.js";

export const login = async () => {
  const spinner = ora("Signing in...").start();

  const session = await createAuthSession();

  await open(`${CLI_AUTH_URL}?sessionId=${session.id}`);

  let token = null;
  let tries = 0;

  while (!token && tries < 60) {
    const newSession = await getSession(session.id);

    if (newSession?.token) {
      token = newSession.token;
    }

    tries++;

    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!token) {
    error("Could not sign in (timeout). Please try again.");
    throw new Error();
  }

  keyringEntry.setPassword(token);

  spinner.succeed("Signed in. You can now use the CLI.");
};

export const link = async () => {
  const { authed, token } = checkAuth();
  if (!authed) return;

  const spinner = ora("Loading projects...").start();
  const teamsWithProjects = await getProjects(token);
  spinner.stop();

  if (teamsWithProjects.length === 0) {
    return warning("You have no projects.");
  }

  const projectId = await select<string>({
    message: "Select a project to link:",
    choices: [
      ...teamsWithProjects.flatMap((team) => [
        new Separator(`--- ${team.name} ---`),
        ...team.projects.map((project) => ({
          name: project.name,
          value: project.id,
        })),
      ]),
    ],
    pageSize: 15,
  });

  const cfg = readSystemConfig();
  const workingDir = process.cwd();

  if (!cfg.projects.find((project) => project.path === workingDir)) {
    cfg.projects.push({
      path: workingDir,
      id: projectId,
    });
  } else {
    cfg.projects = cfg.projects.map((project) => {
      if (project.path === workingDir) {
        return {
          ...project,
          id: projectId,
        };
      }

      return project;
    });
  }

  writeSystemConfig(cfg);

  ora().succeed(
    "Linked project. You can now use the `npx interflex sync` command to sync the translations."
  );
};
