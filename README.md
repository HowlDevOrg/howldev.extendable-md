# Extendable-md

This is a home-grown Markdown parser with sensible defaults to display: 
- (Most) Standard Markdown (see wiki for specifics)
- LaTeX (both inline and codeblock)
- Syntax highlighting through Highlight.js and a sweet code display (my opinion)
- Built-in Mermaid viewer
- Collapsible systems
- Everything runs through DOMPurify by default

What makes it extendable is the overrides you pass into the one exposed component. You can override the default code viewer for a component that better suites your tastes/style, override the LaTeX component if KaTeX isn't working for you, the same for Mermaid blocks. There's also an inline override so you can write some custom HTML elements for a different type, such as ^^(text)^^ would have a custom class/element type you could render. 

## Install

<https://www.npmjs.com/package/@howldev/extendable-md>

Run with: 

```bash
npm i @howldev/extendable-md
```

## Usage

Pass in text and it will display under the div id `extendable-md-container`. There are many custom classes with some information, specifically in tables and my collapsing system, that allow you to style them specifically depending on their state (if they have a header or if they're open or closed). You can check the values in `lib/defaults.css` to see what custom classes you have access to. In the future, these may come styled by default, which you can always override in your own CSS classes. 

This is a basic App component you can use to see it in action. If you can, copy the text from `testing/full-setup.md`, which will show you all the features that I've added.  

```ts
import { ReactNode, useState } from "react";
import { MarkdownDisplay } from "../lib/MarkdownDisplay.js";
import "./App.css";

export function App() {
  const [text, setText] = useState("");

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter markdown here..."
        style={{
            flex: 1,
            padding: "16px",
            fontSize: "16px",
            border: "none",
            fontFamily: "monospace",
        }}
        />
        <div
          style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            borderLeft: "1px solid #ccc",
          }}
        >
          <MarkdownDisplay
            text={text}
          />
        </div>
      </div>
    </>
  );
}
```

For the full setup (overrides), you can use this snippet: 

```ts
import { ReactNode, useState } from "react";
import { MarkdownDisplay } from "../lib/MarkdownDisplay.js";
import "./App.css";

export function App() {
  const [text, setText] = useState("");

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter markdown here..."
        style={{
            flex: 1,
            padding: "16px",
            fontSize: "16px",
            border: "none",
            fontFamily: "monospace",
        }}
        />
        <div
          style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            borderLeft: "1px solid #ccc",
          }}
        >
          <MarkdownDisplay
            text={text}
            codeOverload={ExampleCodeOverride}
            inlineOverload={ExampleInlineOverride}
          />
        </div>
      </div>
    </>
  );
}

function ExampleCodeOverride(
  language: string,
  content: string,
  overload: (language: string, code: string) => ReactNode,
): ReactNode {
  if (language === "my-custom-block") {
    return <p className="my-block">{content}</p>;
  }
  return overload(language, content);
}

function ExampleInlineOverride(text: string): string {
  return text.replace(/\^\^(.+?)\^\^/g, (_, p1) => {
    return `<span class="my-content">${p1}</span>`;
  });
}
```

