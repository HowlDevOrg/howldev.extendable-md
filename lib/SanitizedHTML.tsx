import DOMPurify from 'dompurify';

import parse from 'html-react-parser'

type SanitizedHTMLProps = {
  html: string;
};
export function SanitizedHTML({ html }: SanitizedHTMLProps) {
  return <>{parse(DOMPurify.sanitize(html))}</>
}
