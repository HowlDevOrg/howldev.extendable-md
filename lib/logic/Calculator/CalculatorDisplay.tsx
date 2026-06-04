import { ReactNode } from "react";
import { InteractiveDisplayInputs } from "./CalculatorDisplayInputs";
import { useCalculatorDisplay } from "./Helpers/useCalculatorDisplay";

type CalculatorDisplayProps = {
  text: string;
};

export function CalculatorDisplay({ text }: CalculatorDisplayProps) {
  const { setValues, params, values, paramError, runtimeError, codeResult } =
    useCalculatorDisplay(text);

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
    result.push(
      <p key={i.label}>
        {i.label ? i.label + ":" : ""} {i.value}
      </p>,
    );
  }

  return (
    <div className="calculator-display">
      {paramError ? (
        <p style={{ color: "red" }}>Param parsing error: {paramError}</p>
      ) : (
        <div className="calculator-params">
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
        <div className="calculator-result">{result}</div>
      )}
    </div>
  );
}
