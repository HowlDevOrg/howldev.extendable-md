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
    <>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen(a => !a)}>
        <span className="collapsible-header">{open ? "⯆" : "⯈"}</span>
        {outerComponent}
      </div>
      {open && innerComponent}
    </>
  );
}
