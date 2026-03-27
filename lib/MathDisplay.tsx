import katex from "katex";
import { SanitizedHTML } from "./SanitizedHTML";


type MathDisplayProps = {
  text: string;
  displayAsBlock: boolean;
}

export function MathDisplay({text, displayAsBlock}: MathDisplayProps) {
  var html = katex.renderToString(text, {
    throwOnError: false,
    displayMode: displayAsBlock
  });
  return <SanitizedHTML html={html}/>;
}