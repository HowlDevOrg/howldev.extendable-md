import { MathDisplay } from "./MathDisplay";

type Props = {
  text: string;
};

export function MarkdownDisplay({ text }: Props) {
  // return <div>{separate(text).map(a => <p>{a}</p>)}</div>;
  return <MathDisplay text={text} displayAsBlock={true} />;
}
