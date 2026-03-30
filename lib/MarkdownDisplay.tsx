import { CodeViewer } from "./CodeViewer";
import { MathDisplay } from "./MathDisplay";
import { MermaidDisplay } from "./MermaidDisplay";
import { separate } from "./separate";

type Props = {
  text: string;
};

export function MarkdownDisplay({ text }: Props) {
  const items = separate(text);

  return (<div>
    {items.map(a => {
      switch (a[0]) {
        case '`':
          const items = a.split('\n');
          const type = items[0].slice(3).trimEnd();
          if (type === "math") {
            return <MathDisplay text={items.slice(1, -1).join('\n')} displayAsBlock={true} />
          } else if (type === "mermaid") {
            return <MermaidDisplay text={items.slice(1, -1).join('\n')} />
          } else {
            return <CodeViewer langauge={type} codeLines={items.slice(1, -1).join('\n')}/>
          }
        default: 
          return <p>{a}</p>
      }
    })}
  </div>);
  // return <div>{separate(text).map(a => <p>{a}</p>)}</div>;
  // return <MathDisplay text={text} displayAsBlock={true} />;
  // return <MermaidDisplay text={text} />;
  // return (<div>
  //   <p>Compared to a normal p block:</p>
  //   <blockquote>
  //     This is a blockquote with some <i>italics</i> and <u>underlines</u>? <br/>
  //     And this is a break.
  //     <blockquote>
  //       Inner blockquote.
  //     </blockquote>
  //   </blockquote>
  // </div>)
}
