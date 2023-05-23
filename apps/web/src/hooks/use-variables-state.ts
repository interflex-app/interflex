import { useEffect, useState } from "react";
import { Variable, VariableType } from "../utils/variables";

export const useVariablesState = (
  initialState: Variable[],
  variableNames: string[]
) => {
  const [data, setData] = useState<Variable[]>(
    variableNames.map((it) => {
      const variable = initialState.find((variable) => variable.name === it);
      if (variable) {
        return variable;
      } else {
        return {
          name: it,
          type: VariableType.STRING,
        };
      }
    })
  );

  useEffect(() => {
    setData(() =>
      variableNames.map((it) => {
        const variable = initialState.find((variable) => variable.name === it);
        if (variable) {
          return variable;
        } else {
          return {
            name: it,
            type: VariableType.STRING,
          };
        }
      })
    );
  }, [initialState, variableNames]);

  const changeVariableType = (name: string, type: VariableType) => {
    setData((prev) =>
      prev.map((it) => {
        if (it.name === name) {
          return { ...it, type };
        } else {
          return it;
        }
      })
    );
  };

  return { data, changeVariableType };
};
