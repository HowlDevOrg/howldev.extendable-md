import katex from "katex";
import { SanitizedHTML } from "./SanitizedHTML";

type MathDisplayProps = {
  text: string;
  displayAsBlock: boolean;
};

export function MathDisplay({ text, displayAsBlock }: MathDisplayProps) {
  const html = katex.renderToString(text, {
    throwOnError: false,
    displayMode: displayAsBlock,
  });
  return (
    <figure className="katex-figure">
      <SanitizedHTML html={html} />
    </figure>
  );
}
