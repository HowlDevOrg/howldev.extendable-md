import DOMPurify from 'dompurify';

type SanitizedHTMLProps = {
  html: string;
};
export function SanitizedHTML({ html }: SanitizedHTMLProps) {
  const purified = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{__html: purified}} />
}
