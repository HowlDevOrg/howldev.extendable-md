export type ParamDef =
  StringType
  | NumberType
  | BoolType
  | EnumType

export type StringType = { name: string; type: "string" };
export type NumberType = { name: string; type: "number" };
export type BoolType = { name: string; type: "boolean" };
export type EnumType = { name: string; type: "enum"; values: string[] };