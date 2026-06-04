import { type StructuredReturn } from "../types";

export function StructuredReturnToString(val: StructuredReturn): string {
    switch (val.type) {
        case "string":
            return val.value as string;
        case "bool":
            return val.value ? "true" : "false";
        case "number":
            return val.value.toString();
    }
}
