// design-sync bundle entry: the app's UI kit (src/components/ui) is the
// design system surface — nothing else from the app ships to claude.ai/design.
export * from "../src/components/ui/accordion";
export * from "../src/components/ui/alert";
export * from "../src/components/ui/avatar";
export * from "../src/components/ui/badge";
export * from "../src/components/ui/button";
export * from "../src/components/ui/card";
export * from "../src/components/ui/checkbox";
export * from "../src/components/ui/dialog";
export * from "../src/components/ui/dropdown-menu";
export * from "../src/components/ui/input";
export * from "../src/components/ui/label";
export * from "../src/components/ui/popover";
export * from "../src/components/ui/progress";
export * from "../src/components/ui/radio-group";
export * from "../src/components/ui/scroll-area";
export * from "../src/components/ui/select";
export * from "../src/components/ui/separator";
export * from "../src/components/ui/sheet";
export * from "../src/components/ui/skeleton";
export * from "../src/components/ui/slider";
export * from "../src/components/ui/sonner";
export * from "../src/components/ui/switch";
export * from "../src/components/ui/tabs";
export * from "../src/components/ui/textarea";
export * from "../src/components/ui/toggle";
export * from "../src/components/ui/toggle-group";
export * from "../src/components/ui/tooltip";
// toast() must come from the SAME sonner instance the bundled Toaster
// subscribes to — an app-side `import { toast } from "sonner"` would talk to
// a second copy and no toast would ever appear.
export { toast } from "sonner";
