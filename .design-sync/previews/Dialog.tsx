import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "tracks";

export const Open = () => (
  <Dialog open>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Submit response?</DialogTitle>
        <DialogDescription>
          Submitting sends your writing for feedback. You can reopen it to
          edit after grading.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Keep editing</Button>
        </DialogClose>
        <Button>Submit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const DestructiveConfirm = () => (
  <Dialog open>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove stored key?</DialogTitle>
        <DialogDescription>
          Grading will fall back to the site default model until you add a
          new key.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant="destructive">Remove key</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
