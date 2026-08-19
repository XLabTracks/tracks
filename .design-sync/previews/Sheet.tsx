import {
  Button,
  Label,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
} from "tracks";

export const Open = () => (
  <Sheet open>
    <SheetContent side="right">
      <SheetHeader>
        <SheetTitle>Display settings</SheetTitle>
        <SheetDescription>
          Reading preferences for papers and lessons.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sidenotes">Margin sidenotes</Label>
          <Switch id="sidenotes" defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="dark">Dark mode</Label>
          <Switch id="dark" />
        </div>
      </div>
      <SheetFooter>
        <Button>Save preferences</Button>
        <SheetClose asChild>
          <Button variant="ghost">Cancel</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const LeftNav = () => (
  <Sheet open>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>Jump to a tab.</SheetDescription>
      </SheetHeader>
      <nav className="flex flex-col gap-1 px-2 text-sm">
        {["Overview", "Lessons", "Exercises", "Review"].map((item, i) => (
          <a
            key={item}
            href="#"
            className={
            i === 0
                ? "rounded-md bg-accent px-2 py-1.5 font-medium text-accent-foreground"
                : "rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }
          >
            {item}
          </a>
        ))}
      </nav>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
