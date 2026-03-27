import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { SanitizedHTML } from "./SanitizedHTML";


type Props = {
  text: string;
};

export function MermaidDisplay({ text }: Props) {
  const [svgData, setSvgData] = useState<string>("");

  mermaid.initialize({
    securityLevel: "strict", 
    htmlLabels: false
  });

  useEffect(() => {
    async function set() {
      const { svg } = await mermaid.render("diagram-id", text);
      setSvgData(svg);
    }
    
    setTimeout(set, 500);
  }, [text]);

  return <SanitizedHTML html={svgData} />;
}