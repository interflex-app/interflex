import { Variable } from "interflex-internal";
import { type Prisma } from "@prisma/client";

export const jsonToVariables = (json: Prisma.JsonValue) => {
  return Array.from(json as Prisma.JsonArray).map((it) => it as Variable);
};

export const variablesToJson = (variables: Variable[]) => {
  return variables as Prisma.JsonArray;
};

export const extractVariablesFromString = (str: string) => {
  const regex = /{([A-Za-z0-9_]+)}/g;
  const matches = [...str.matchAll(regex)];
  return matches.map((it) => it[1]);
};
