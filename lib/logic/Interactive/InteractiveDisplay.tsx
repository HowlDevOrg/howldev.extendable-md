import { ReactNode, useCallback, useEffect, useState } from "react";
import { EnumType, ParamDef } from "./types";
import { ParamDefSplitter } from "./ParamDef";

type InteractiveDisplayProps = {
  text: string;
};

export function InteractiveDisplay({ text }: InteractiveDisplayProps) {
  const [params, setParams] = useState<ParamDef[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const items = ParamDefSplitter(text.split("\n"));
      setParams(items);
      setValues(
        items.map((a) => {
          switch (a.type) {
            case "string":
              return "";
            case "boolean":
              return "false";
            case "number":
              return "0";
            case "enum":
              return a.values[0];
          }
        }),
      );
      setError(null);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : String(ex));
    }
  }, [text]);

  const updateValues = (index: number, value: string) => {
    if (Number(value)) {
      value = Number(value).toString();
    }
    setValues((a) =>
      a.map((a, i) => {
        if (i == index) return value;
        return a;
      }),
    );
  };

  const result: ReactNode[] = [];
  for (const i of values) {
    result.push(<p>{i !== "" ? i : "empty"}</p>);
  }

  return (
    <div className="interactive-display">
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className="interactive-params">
        {params.map((a, i) => {
          if (a.type == "string") {
            return (
              <label key={a.name + i}>
                {a.name}:
                <input
                  value={values[i]}
                  onChange={(e) => updateValues(i, e.target.value)}
                />
              </label>
            );
          } else if (a.type == "number") {
            return (
              <label key={a.name + i}>
                {a.name}:
                <input
                  type="number"
                  value={values[i]}
                  onChange={(e) => updateValues(i, e.target.value)}
                />
              </label>
            );
          } else if (a.type == "boolean") {
            const bool = values[i] == "true";
            return (
              <label key={a.name + i}>
                {a.name}:
                <input
                  type="checkbox"
                  checked={bool}
                  onClick={(_) => updateValues(i, bool ? "false" : "true")}
                />
              </label>
            );
          } else if (a.type == "enum") {
            const obj = a as EnumType;
            return (
              <select
                onChange={(e) => updateValues(i, e.target.value)}
                value={values[i]}
              >
                {obj.values.map((a) => (
                  <option value={a}>{a}</option>
                ))}
              </select>
            );
          }
          throw new Error(
            "Unreachable place at the end of Interactive Display.",
          );
        })}
      </div>
      <div className="interactive-result">{result}</div>
    </div>
  );
}
