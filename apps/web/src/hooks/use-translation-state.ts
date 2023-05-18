import { useEffect, useState } from "react";
import { RouterInputs } from "../utils/api";
import { SupportedLanguage, TranslationAction } from "../consts";

const NEW_ID_PREFIX = "new-";

export type TranslationStateRow = Omit<
  CreateTranslationActionEntry | UpdateTranslationActionEntry,
  "action"
> & { id: string; state?: TranslationRowState; locked?: boolean };

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

export enum TranslationRowState {
  Created,
  Updated,
  Deleted,
  Placeholder,
}

const getNewId = () =>
  `${NEW_ID_PREFIX}${(Math.random() * 100_000).toString().slice(0, 5)}`;

export const useTranslationState = (initialState: TranslationStateRow[]) => {
  const [data, setData] = useState<TranslationStateRow[]>([
    ...initialState,
    {
      id: getNewId(),
      key: "",
      values: [],
      state: TranslationRowState.Placeholder,
    },
  ]);

  useEffect(() => {
    if (!data.find((row) => row.state === TranslationRowState.Placeholder)) {
      setData((prev) => [
        ...prev,
        {
          id: getNewId(),
          key: "",
          values: [],
          state: TranslationRowState.Placeholder,
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    const emptyCreatedRowIds = data
      .filter(
        (row) =>
          row.key === "" &&
          row.values.length === 0 &&
          row.state === TranslationRowState.Created
      )
      .map((row) => row.id);

    const emptyUpdatedRowIds = data
      .filter(
        (row) =>
          row.key === "" &&
          row.values.length === 0 &&
          row.state === TranslationRowState.Updated
      )
      .map((row) => row.id);

    if (emptyCreatedRowIds.length > 0 || emptyUpdatedRowIds.length > 0) {
      setData((prev) =>
        prev
          .filter((row) => !emptyCreatedRowIds.includes(row.id))
          .map((row) => {
            if (emptyUpdatedRowIds.includes(row.id)) {
              return { ...row, state: TranslationRowState.Deleted };
            } else {
              return row;
            }
          })
      );
    }
  }, [data]);

  const resetWithState = (newData: TranslationStateRow[]) => {
    setData([
      ...newData,
      {
        id: getNewId(),
        key: "",
        values: [],
        state: TranslationRowState.Placeholder,
      },
    ]);
  };

  const updateKey = (id: string, newKey: string) => {
    if (!id.includes(NEW_ID_PREFIX)) {
      const initialStateKey = initialState.find((row) => row.id === id)?.key;

      const initialStateValues = initialState.find(
        (row) => row.id === id
      )?.values;

      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return {
              ...row,
              key: newKey,
              state:
                initialStateKey === newKey &&
                JSON.stringify(initialStateValues) ===
                  JSON.stringify(row.values)
                  ? undefined
                  : TranslationRowState.Updated,
            };
          } else {
            return row;
          }
        })
      );
    } else {
      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return { ...row, key: newKey, state: TranslationRowState.Created };
          } else {
            return row;
          }
        })
      );
    }
  };

  const updateValue = (
    id: string,
    language: SupportedLanguage,
    newValue: string
  ) => {
    if (!id.includes(NEW_ID_PREFIX)) {
      const initialStateKey = initialState.find((row) => row.id === id)?.key;

      const initialStateValues = initialState.find(
        (row) => row.id === id
      )?.values;

      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            const newValues =
              newValue === ""
                ? row.values.filter((val) => val.language !== language)
                : row.values.find((val) => val.language === language)
                ? row.values.map((val) => {
                    if (val.language === language) {
                      return { ...val, value: newValue };
                    } else {
                      return val;
                    }
                  })
                : [...row.values, { language, value: newValue }];

            return {
              ...row,
              values: newValues,
              state:
                initialStateKey === row.key &&
                JSON.stringify(initialStateValues) === JSON.stringify(newValues)
                  ? undefined
                  : TranslationRowState.Updated,
            };
          } else {
            return row;
          }
        })
      );
    } else {
      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            const newValues =
              newValue === ""
                ? row.values.filter((val) => val.language !== language)
                : row.values.find((val) => val.language === language)
                ? row.values.map((val) => {
                    if (val.language === language) {
                      return { ...val, value: newValue };
                    } else {
                      return val;
                    }
                  })
                : [...row.values, { language, value: newValue }];

            return {
              ...row,
              values: newValues,
              state: TranslationRowState.Created,
            };
          } else {
            return row;
          }
        })
      );
    }
  };

  console.log(data);

  const deleteRow = (id: string) => {
    if (!id.includes(NEW_ID_PREFIX)) {
      setData((prev) =>
        prev.map((row) => {
          if (row.id === id) {
            return { ...row, state: TranslationRowState.Deleted, locked: true };
          } else {
            return row;
          }
        })
      );
    } else {
      setData((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const getActions = (): TranslationActionEntry[] => {
    return data
      .filter(
        (row) =>
          row.state !== undefined &&
          row.state !== TranslationRowState.Placeholder
      )
      .map(({ state, id, ...row }) =>
        state === TranslationRowState.Created
          ? { ...row, action: TranslationAction.Create, id: id || "" }
          : state === TranslationRowState.Updated
          ? { ...row, action: TranslationAction.Update, id: id || "" }
          : { action: TranslationAction.Delete, id: id || "" }
      );
  };

  return {
    data,
    getActions,
    updateKey,
    updateValue,
    resetWithState,
    deleteRow,
  };
};
