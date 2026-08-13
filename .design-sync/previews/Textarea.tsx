import { Button, Label, Textarea } from "tracks";

export const Canonical = () => (
  <Textarea className="w-96" placeholder="Draft your written response…" />
);

export const WithLabel = () => (
  <div className="w-96 space-y-2">
    <Label htmlFor="ta-response">Your response</Label>
    <Textarea
      id="ta-response"
      className="min-h-28"
      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    />
    <p className="text-muted-foreground text-sm">
      Drafts save automatically. Submit when you're ready for feedback.
    </p>
  </div>
);

export const States = () => (
  <div className="w-96 space-y-3">
    <Textarea placeholder="Default" />
    <Textarea disabled defaultValue="Submitted — reopen to edit." />
    <div className="space-y-1.5">
      <Textarea aria-invalid defaultValue="Lorem ipsum dolor sit amet." />
      <p className="text-destructive text-sm">
        Responses must be at least 50 words.
      </p>
    </div>
  </div>
);

export const AssessmentComposition = () => (
  <div className="w-[28rem] space-y-3 rounded-lg border border-input p-4">
    <div className="space-y-1">
      <Label htmlFor="ta-assessment">End-of-module written assessment</Label>
      <p className="text-muted-foreground text-sm">
        Graded on reasoning transparency, not conclusions.
      </p>
    </div>
    <Textarea
      id="ta-assessment"
      className="min-h-32"
      placeholder="Write your argument here…"
    />
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs">Draft · 0 words</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Save draft
        </Button>
        <Button size="sm">Submit</Button>
      </div>
    </div>
  </div>
);
