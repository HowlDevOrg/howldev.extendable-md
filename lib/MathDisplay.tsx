import katex from "katex";
import { SanitizedHTML } from "./SanitizedHTML";


type MathDisplayProps = {
  text: string;
}

export function MathDisplay({text}: MathDisplayProps) {
  var html = katex.renderToString(text, {
    throwOnError: false
  });
  // return <div>{separate(text).map(a => <p>{a}</p>)}</div>;
  return <SanitizedHTML html={html}/>;
}