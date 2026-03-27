import { MermaidDisplay } from "./MermaidDisplay";

type Props = {
  text: string;
};

export function MarkdownDisplay({ text }: Props) {
  // return <div>{separate(text).map(a => <p>{a}</p>)}</div>;
  return <MermaidDisplay text={text} />;
}
