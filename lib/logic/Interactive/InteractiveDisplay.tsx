import { ReactNode, useCallback, useEffect, useState } from "react";
import { EnumType, ParamDef } from "./types";
import { ParamDefSplitter } from "./ParamDef";
import { ExecuteCode } from "./ExecuteCode";

type InteractiveDisplayProps = {
  text: string;
};

export function InteractiveDisplay({ text }: InteractiveDisplayProps) {
  const [params, setParams] = useState<ParamDef[]>([]);
  const [code, setCode] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const newParamsRaw: string[] = [];
      const newCode: string[] = [];
      const items = text.split("\n");
      let params = true;
      for (let i = 0; i < items.length; i++) {
        if (items[i] === "---") {
          params = false;
        } else if (params) {
          newParamsRaw.push(items[i]);
        } else {
          newCode.push(items[i]);
        }
      }
      const newParams = ParamDefSplitter(newParamsRaw);
      setParams(newParams);
      setCode(newCode);
      setValues(
        newParams.map((a) => {
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
  try {
    const returns = ExecuteCode(params, values, code);
    for (const i of returns) {
      result.push(
        <p>
          {i.label}: {i.value}
        </p>,
      );
    }
  } catch (ex: any) {
    return (
        <p style={{color: "red"}}>Code syntax error: {ex.message}</p>
    )
  }

  return (
    <div className="interactive-display">
      {error && <p style={{ color: "red" }}>Param parsing error: {error}</p>}
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
