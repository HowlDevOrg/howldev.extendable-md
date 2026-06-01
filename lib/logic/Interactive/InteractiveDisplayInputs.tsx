import { ParamDef, EnumType } from "./types";

type InteractiveDisplayInputsProps = {
  params: ParamDef[];
  values: string[];
  updateValues: (index: number, value: string) => void;
};
export function InteractiveDisplayInputs({
  params,
  values,
  updateValues,
}: InteractiveDisplayInputsProps) {
  return params.map((a, i) => {
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
      "Unreachable place at the end of Interactive Display Inputs.",
    );
  });
}
