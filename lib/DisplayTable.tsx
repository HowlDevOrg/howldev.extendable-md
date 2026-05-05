import { InlineMD } from "./InlineMarkdown";
import { SanitizedHTML } from "./SanitizedHTML";

/**
 * Takes in pipe and newline-separated text and renders a
 * React component that displays that table.
 * @param text Newline and Pipe table
 * @returns React component
 */
export function DisplayTable({ text }: { text: string; }) {
  const lines = text.split("\n").map((a) => a
    .split("|")
    .slice(1, -1)
    .map((b) => b.trim())
  );
  const isHeader = lines[1][0].match(/^:?-+:?$/g);
  if (isHeader) {
    const alignment: number[] = lines[1].map((a) => {
      if (a.startsWith(":") && a.endsWith(":")) {
        return 0; // Center
      } else if (a.endsWith(":")) {
        return 1; // Right
      } else {
        return -1; // Left
      }
    });
    return (
      <table>
        <thead>
          <tr>
            {lines[0].map((a, i) => (
              <th
                style={{
                  textAlign: alignment[i] !== -1
                    ? alignment[i] === 0
                      ? "center"
                      : "end"
                    : "start",
                }}
              >
                <SanitizedHTML html={InlineMD(a)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.slice(2).map((a) => (
            <tr>
              {a.map((b, i) => (
                <td
                  style={{
                    textAlign: alignment[i] !== -1
                      ? alignment[i] === 0
                        ? "center"
                        : "end"
                      : "start",
                  }}
                >
                  <SanitizedHTML html={InlineMD(b)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return (
      <table>
        <tbody>
          {lines.map((a) => (
            <tr>
              {a.map((b) => (
                <td>
                  <SanitizedHTML html={InlineMD(b)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
