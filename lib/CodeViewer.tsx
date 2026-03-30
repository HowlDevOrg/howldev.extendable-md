import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import csharp from 'highlight.js/lib/languages/csharp';
import xml from 'highlight.js/lib/languages/xml';
import yml from 'highlight.js/lib/languages/yaml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yml);
hljs.registerLanguage('yml', yml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);


/** 
 * Code Viewer takes in a language and an array of strings with the backtick(``) preferred for their definition. They use 
 * HighlightJS to do syntax highlighting for JS, TS, C#, XML, and YML. 
 */
export function CodeViewer(props: { langauge: string, codeLines: string }) {
  const [buttonColor, setButtonColor] = useState("#242424");
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Unset existing highlight state before applying a new one.
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [props.codeLines]);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(props.codeLines).then(
      () => console.log("Text copied to clipboard!"),
      (err) => console.error("Failed to copy text: ", err)
    );

    setButtonColor("#1c8c12");
    setTimeout(() => setButtonColor("#242424"), 3000);
  };

  const buttonTextColor = buttonColor === "#1c8c12" ? "#000000" : "#ffffff";

  return (
    <div className="code-interface">
      <div>
        <p>{props.langauge}</p>
        <button
          onClick={copyToClipboard}
          style={{
            alignSelf: "end",
            backgroundColor: `${buttonColor}`,
            color: `${buttonTextColor}`,
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >Copy</button>
      </div>
      <pre>
        <code ref={codeRef} className={'language-' + props.langauge}>
          {props.codeLines}
        </code>
      </pre>
    </div>
  );
}

