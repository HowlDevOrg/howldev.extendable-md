import DOMPurify from "dompurify";
import parse from "html-react-parser";

type SanitizedHTMLProps = {
  html: string;
};

// Some logic so I can have targets in anchor tags.
DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  // set all elements owning target to target=_blank
  if ("target" in node) {
    node.setAttribute("target", "_blank");
  }
  // set non-HTML/MathML links to xlink:show=new
  if (
    !node.hasAttribute("target") &&
    (node.hasAttribute("xlink:href") || node.hasAttribute("href"))
  ) {
    node.setAttribute("xlink:show", "new");
  }
});

export function SanitizedHTML({ html }: SanitizedHTMLProps) {
  return <>{parse(DOMPurify.sanitize(html))}</>;
}
