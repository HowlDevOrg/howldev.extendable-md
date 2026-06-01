import { useState, useMemo } from "react";
import { ExecuteCode } from "./ExecuteCode";
import { getDefault } from "./getDefault";
import { parseParamsAndCode } from "./parseParamsAndCode";

export function useInteractiveDisplay(text: string) {
  const [values, setValues] = useState<string[]>([]);

  const { params, code, paramError } = useMemo(() => {
    try {
      const { newParams, newCode } = parseParamsAndCode(text);
      // This does not create an infinite render loop and this is intended behavior.. I don't know 
      // how to fix it in the React system. 
      // eslint-disable-next-line
      setValues(newParams.map(getDefault));
      return {
        params: newParams,
        code: newCode,
        paramError: null,
      };
    } catch (ex) {
      return {
        params: [],
        code: [],
        paramError: ex instanceof Error ? ex.message : String(ex),
      };
    }
  }, [text]);

  const { codeResult, runtimeError } = useMemo(() => {
    if (code.length > 0) {
      try {
        const returns = ExecuteCode(params, values, code);
        return { codeResult: returns, runtimeError: null };
      } catch (ex) {
        return {
          codeResult: [],
          runtimeError: ex instanceof Error ? ex.message : String(ex),
        };
      }
    } else {
      return { codeResult: [], runtimeError: null };
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
