import { ReactNode, useState } from "react";

type Props = {
  outerComponent: ReactNode;
  defaultOpen: boolean;
  innerComponent: ReactNode;
};

export function CollapsibleSystem({
  outerComponent,
  defaultOpen,
  innerComponent,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-system ${open ? "open" : ""}` }>
      <div className="collapsible-header" onClick={() => setOpen(a => !a)}>
        <span className="collapsible-icon">{open ? "⯆" : "⯈"}</span>
        {outerComponent}
      </div>
      {open && innerComponent}
    </div>
  );
}
