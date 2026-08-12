import { DemoById } from "@/components/demos/demo-renderer";

export interface DemoProps {
  /** Registry ID of the demo to render. */
  id: string;
  /** When false, render the bare demo without the titled frame. */
  framed?: boolean;
}

// MDX entry point: <Demo id="…"/> renders the registered demo in its frame.
export function Demo({ id, framed }: DemoProps) {
  return <DemoById id={id} framed={framed} />;
}
