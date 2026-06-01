import { ReactNode } from "react";
import { InteractiveDisplayInputs } from "./InteractiveDisplayInputs";
import { useInteractiveDisplay } from "./useInteractiveDisplay";

type InteractiveDisplayProps = {
  text: string;
};

export function InteractiveDisplay({ text }: InteractiveDisplayProps) {
  const { setValues, params, values, paramError, runtimeError, codeResult } =
    useInteractiveDisplay(text);

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
  for (const i of codeResult) {
    result.push(<p>{i.label}: {i.value}</p>)
  }

  return (
    <div className="interactive-display">
      {paramError ? (
        <p style={{ color: "red" }}>Param parsing error: {paramError}</p>
      ) : (
        <div className="interactive-params">
          <InteractiveDisplayInputs
            params={params}
            values={values}
            updateValues={updateValues}
          />
        </div>
      )}
      {runtimeError ? (
        <p style={{ color: "red" }}>Code syntax error: {runtimeError}</p>
      ) : (
        <div className="interactive-result">{result}</div>
      )}
    </div>
  );
}
