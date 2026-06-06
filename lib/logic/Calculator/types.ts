export type ParamDef = StringType | NumberType | BoolType | EnumType;

export type StringType = { name: string; type: "string"; default?: string };
export type NumberType = { name: string; type: "number"; default?: string };
export type BoolType = { name: string; type: "boolean"; default?: string };
export type EnumType = {
  name: string;
  type: "enum";
  values: string[];
  default?: string;
};

export type StructuredOutput = {
  type: "string" | "bool" | "number";
  value: string | boolean | number;
};

export type ObjectWithStructuredValue = {
  [key: string]: StructuredOutput;
};

export type ExecutionReturn = {
  label: string;
  value: string;
};

export type StructuredReturn = {
  label: string;
  type: "string" | "bool" | "number";
  value: string | boolean | number;
};
