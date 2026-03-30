import React from 'react';
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
 * @example <CodeViewer langauge="YAML/C#" codeLines={[
           `// Program.cs`,
           `reader["second"]["arrayOfObjects"][0]["lorem"].AsString(); // "ipsum"`,
           `reader["first"]["simple Array"][2].AsInt();                // 3`
         ]} />
 */
export class CodeViewer extends React.Component<{ langauge: string, codeLines: string }, { buttonColor: string }> {
  state = {
    buttonColor: "#242424"
  }

  private codeRef = React.createRef<HTMLElement>();

  componentDidMount(): void {
    this.highlightCode();
  }

  componentDidUpdate(prevProps: { codeLines: string }) {
    if (prevProps.codeLines !== this.props.codeLines) {
      this.highlightCode();
    }
  }

  highlightCode(): void {
    if (this.codeRef.current) {
      // Unset existing highlight state before applying a new one
      this.codeRef.current.removeAttribute("data-highlighted");

      // Now apply highlighting
      hljs.highlightElement(this.codeRef.current);
    }
  }

  copyToClipboard = (): void => {
    navigator.clipboard.writeText(this.props.codeLines).then(
      () => console.log("Text copied to clipboard!"),
      (err) => console.error("Failed to copy text: ", err)
    );
    this.setState({ buttonColor: "#1c8c12" });
    setTimeout(() => this.setState({ buttonColor: "#242424" }), 3000);
  }


  render() {
    const buttonTextColor = this.state.buttonColor === "#1c8c12" ? "#000000" : "#ffffff";
    return (
      <div className="code-interface">
        <div>
          <p>{this.props.langauge}</p>
          <button
            onClick={this.copyToClipboard}
            style={{
              alignSelf: "end",
              backgroundColor: `${this.state.buttonColor}`,
              color: `${buttonTextColor}`,
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >Copy</button>
        </div>
        <pre>
          <code ref={this.codeRef} className={'language-' + this.props.langauge}>
            {this.props.codeLines}
          </code>
        </pre>
      </div>
    );
  }
}

