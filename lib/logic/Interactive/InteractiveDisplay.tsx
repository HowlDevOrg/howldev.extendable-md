import { useCallback, useEffect, useState } from "react";
import { ParamDef } from "./types";
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
    setValues((a) =>
      a.map((a, i) => {
        if (i == index) return value;
        return a;
      }),
    );
  };

  console.log(values);

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
                  defaultValue={Number(values[i])}
                  onBlur={(e) => updateValues(i, Number(e.target.value).toString())}
                />
              </label>
            );
          }
          return (
            <p>
              {a.name}: {a.type}
            </p>
          );
        })}
      </div>
    </div>
  );
}
