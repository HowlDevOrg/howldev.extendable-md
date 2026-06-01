import { useState, useEffect } from "react";
import { ExecutionReturn, ExecuteCode } from "./ExecuteCode";
import { getDefault } from "./getDefault";
import { parseParamsAndCode } from "./parseParamsAndCode";
import { ParamDef } from "./types";

export function useInteractiveDisplay(text: string) {
  const [params, setParams] = useState<ParamDef[]>([]);
  const [code, setCode] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [paramError, setParamError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [codeResult, setCodeResult] = useState<ExecutionReturn[]>([]);

  useEffect(() => {
    try {
      const { newParams, newCode } = parseParamsAndCode(text);
      setParams(newParams);
      setCode(newCode);
      setValues(newParams.map(getDefault));
      setParamError(null);
    } catch (ex) {
      setParamError(ex instanceof Error ? ex.message : String(ex));
    }
  }, [text]);

  useEffect(() => {
    if (code.length > 0) {
      try {
        const returns = ExecuteCode(params, values, code);
        setCodeResult(returns);
        setRuntimeError(null);
      } catch (ex) {
        setRuntimeError(ex instanceof Error ? ex.message : String(ex));
      }
    }
  }, [params, values, code]);

  return {
    setValues,
    params,
    values,
    paramError,
    runtimeError,
    codeResult,
  };
}
