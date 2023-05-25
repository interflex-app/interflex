import { z } from "zod";
import { APP_URL } from "./consts.js";
import { error } from "./cli.js";

export const createAuthSession = async () => {
  const res = await fetch(`${APP_URL}/api/cli/auth-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const parsed = z
    .object({
      session: z
        .object({
          id: z.string(),
          expiresAt: z.string(),
        })
        .nullable(),
    })
    .safeParse(await res.json());

  if (!parsed.success) {
    return error("There was an error creating the auth session.");
  }

  if (!parsed.data.session) {
    return error("There was an error creating the auth session.");
  }

  return parsed.data.session;
};

export const getSession = async (sessionId: string) => {
  const res = await fetch(
    `${APP_URL}/api/cli/auth-session?sessionId=${sessionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const parsed = z
    .object({
      session: z
        .object({
          id: z.string(),
          token: z.string().nullable(),
          expiresAt: z.string(),
        })
        .nullable(),
    })
    .safeParse(await res.json());

  if (!parsed.success) {
    console.log(parsed.error);
    return error("There was an error getting the auth session.");
  }

  return parsed.data.session;
};

export const getProjects = async (authToken: string) => {
  const res = await fetch(`${APP_URL}/api/cli/get-projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${authToken}`,
    },
  });

  const parsed = z
    .object({
      projects: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          team: z.object({
            id: z.string(),
            name: z.string(),
          }),
        })
      ),
    })
    .safeParse(await res.json());

  if (!parsed.success) {
    return error("There was an error getting the projects.");
  }

  const projects = parsed.data.projects;

  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.team.id]) {
      acc[project.team.id] = {
        id: project.team.id,
        name: project.team.name,
        projects: [],
      };
    }

    acc[project.team.id].projects.push(project);

    return acc;
  }, {} as Record<string, { id: string; name: string; projects: any[] }>);

  return Object.values(groupedProjects);
};

export const getTranslations = async (authToken: string, projectId: string) => {
  const res = await fetch(
    `${APP_URL}/api/cli/get-translations?projectId=${projectId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
    }
  );

  const parsed = z
    .object({
      translations: z
        .array(
          z.object({
            key: z.string(),
            value: z.any(),
            variables: z
              .array(
                z.object({
                  name: z.string(),
                  type: z.enum(["STRING", "NUMBER", "DATE"]),
                })
              )
              .nullable(),
          })
        )
        .nullable(),
    })
    .safeParse(await res.json());

  if (!parsed.success) {
    console.log(parsed.error);
    return error("There was an error getting the translations.");
  }

  return parsed.data.translations;
};
