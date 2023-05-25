import { type Prisma } from "@prisma/client";

export enum VariableType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
}

type VariableStringOptions = Record<string, never>;

type VariableNumberOptions = Record<string, never>;

type VariableDateOptions = Record<string, never>;

type VariableOptions = {
  STRING: VariableStringOptions;
  NUMBER: VariableNumberOptions;
  DATE: VariableDateOptions;
};

export type Variable<T extends VariableType = VariableType> = {
  name: string;
  type: T;
  options?: VariableOptions[T];
};

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
