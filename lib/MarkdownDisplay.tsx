import katex from "katex";
import { SanitizedHTML } from "./SanitizedHTML";

type Props = {
  text: string;
};

export function MarkdownDisplay({ text }: Props) {
  var html = katex.renderToString(text, {
    throwOnError: false
});
  // return <div>{separate(text).map(a => <p>{a}</p>)}</div>;
  return <SanitizedHTML html={html}/>;
}


