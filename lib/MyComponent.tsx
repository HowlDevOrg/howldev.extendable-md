import { greet } from "./greet";

type Props = {
  label: string;
};

export function MyComponent({ label }: Props) {
  return <div>{greet(label)}</div>;
}
