import { useState } from "react";
import { RouterInputs } from "../utils/api";
import { SupportedLanguage, TranslationAction } from "../consts";

const NEW_ID_PREFIX = "new-";

export type TranslationStateRow = Omit<
  CreateTranslationActionEntry | UpdateTranslationActionEntry,
  "action"
> & { id: string | null };

export type TranslationActionEntry =
  RouterInputs["project"]["syncTranslations"]["translations"][number];

export type CreateTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Create }
>;

export type UpdateTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Update }
>;

export type DeleteTranslationActionEntry = Extract<
  TranslationActionEntry,
  { action: TranslationAction.Delete }
>;

enum RowState {
  Created,
  Updated,
}

type InternalStateRow = {
  state?: RowState;
};

const getNewId = () =>
  `${NEW_ID_PREFIX}${(Math.random() * 100_000).toString().slice(0, 5)}`;

export const useTranslationState = (initialState: TranslationStateRow[]) => {
  const [data, setData] =
    useState<(TranslationStateRow & InternalStateRow)[]>(initialState);

  const updateKey = (id: string | null, newKey: string) => {
    if (id && !id.includes(NEW_ID_PREFIX)) {
      const initialStateKey = initialState.find((row) => row.id === id)?.key;

      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return {
              ...row,
              key: newKey,
              state: newKey === initialStateKey ? undefined : RowState.Updated,
            };
          } else {
            return row;
          }
        })
      );
    } else if (id && id.includes(NEW_ID_PREFIX)) {
      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return { ...row, key: newKey, state: RowState.Created };
          } else {
            return row;
          }
        })
      );
    } else if (!id) {
      setData((prev) => [
        ...prev,
        { id: getNewId(), key: newKey, values: [], state: RowState.Created },
      ]);
    }
  };

  const updateValue = (
    id: string | null,
    language: SupportedLanguage,
    newValue: string
  ) => {
    if (id && !id.includes(NEW_ID_PREFIX)) {
      const initialStateValues = initialState.find(
        (row) => row.id === id
      )?.values;

      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return {
              ...row,
              values: row.values.map((val) => {
                if (val.language === language) {
                  return { ...val, value: newValue };
                } else {
                  return val;
                }
              }),
              state:
                JSON.stringify(initialStateValues) ===
                JSON.stringify(row.values)
                  ? undefined
                  : RowState.Updated,
            };
          } else {
            return row;
          }
        })
      );
    } else if (id && id.includes(NEW_ID_PREFIX)) {
      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return {
              ...row,
              values: row.values.map((val) => {
                if (val.language === language) {
                  return { ...val, value: newValue };
                } else {
                  return val;
                }
              }),
              state: RowState.Created,
            };
          } else {
            return row;
          }
        })
      );
    } else if (!id) {
      setData((prev) => [
        ...prev,
        {
          id: getNewId(),
          key: "",
          values: [{ language, value: newValue }],
          state: RowState.Created,
        },
      ]);
    }
  };

  const getActions = (): TranslationActionEntry[] => {
    return data
      .filter((row) => row.state !== undefined)
      .map(({ state, id, ...row }) =>
        state === RowState.Created
          ? { ...row, action: TranslationAction.Create }
          : { ...row, action: TranslationAction.Update, id: id || "" }
      );
  };

  return { data, getActions, updateKey, updateValue };
};
