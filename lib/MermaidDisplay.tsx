import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { SanitizedHTML } from "./SanitizedHTML";

type Props = {
  text: string;
  refreshInterval?: number | undefined;
};

export function MermaidDisplay({ text, refreshInterval }: Props) {
  const [svgData, setSvgData] = useState<string>("");
  const queuedTextRef = useRef(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderCounterRef = useRef(0);

  useEffect(() => {
    mermaid.initialize({
      securityLevel: "strict",
      htmlLabels: false,
    });

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    queuedTextRef.current = text;

    if (timerRef.current !== null) {
      return;
    }

    timerRef.current = setTimeout(async () => {
      timerRef.current = null;

      const renderId = ++renderCounterRef.current;
      try {
        const { svg } = await mermaid.render(
          `diagram-${renderId}`,
          queuedTextRef.current,
        );

        // Only commit the latest completed render in case async renders overlap.
        if (renderId === renderCounterRef.current) {
          setSvgData(svg);
        }
      } catch (e: any) {
        setSvgData(`Error: ${e}`)
      }
        
    }, refreshInterval ?? 100);
  }, [text]);

  return <SanitizedHTML html={svgData} />;
}
