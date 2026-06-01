import { ReactNode, useCallback, useEffect, useState } from "react";
import { ParamDef } from "./types";
import { ExecuteCode } from "./ExecuteCode";
import { parseParamsAndCode } from "./parseParamsAndCode";
import { getDefault } from "./getDefault";
import { InteractiveDisplayInputs } from "./InteractiveDisplayInputs";

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
      const { newParams, newCode } = parseParamsAndCode(text);
      setParams(newParams);
      setCode(newCode);
      setValues(newParams.map(getDefault));
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
  if (code.length > 0) {
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
      return <p style={{ color: "red" }}>Code syntax error: {ex.message}</p>;
    }
  }

  return (
    <div className="interactive-display">
      {error && <p style={{ color: "red" }}>Param parsing error: {error}</p>}
      <div className="interactive-params">
        <InteractiveDisplayInputs
          params={params}
          values={values}
          updateValues={updateValues}
        />
      </div>
      <div className="interactive-result">{result}</div>
    </div>
  );
}
