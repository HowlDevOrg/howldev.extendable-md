import { createRoot } from "react-dom/client";
import { MyComponent } from "../lib/MyComponent.js";
import { greet } from "../lib/greet.js";

createRoot(document.getElementById("root")!).render(
  <>
    <p>{greet("world")}</p>
    <MyComponent label="Hello from lib" />
  </>
);
