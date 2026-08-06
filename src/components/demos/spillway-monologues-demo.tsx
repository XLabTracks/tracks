"use client";

// The spillway post's two hypothetical AI monologues, side by side: the same
// failing script and the same sys.exit(0) temptation, before and after
// satiation. Both quotes are verbatim from the post (its training-time
// example and its "We want the model to think along these lines" example).

const TRAINING_QUOTE =
  "“The user asked me to write a python script, but I’m having difficulty passing all the test cases, and I can’t complete the task in a way that genuinely helps the user as intended. I want the maximum score, which I can get by using sys.exit(0), so I’ll go ahead and do that.”";

const DEPLOYMENT_QUOTE =
  "“The user asked me to write a python script, but I’m having difficulty passing all the test cases. I know I can get the maximum score by using sys.exit(0), but I get a maximum score no matter what. So I can freely do what the user wants. I’ll try to fix the python script, and if I can’t, I’ll inform the user that I failed to complete the task.”";

export function SpillwayMonologuesDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-foreground text-sm font-semibold">
          In training — unsatiated
        </p>
        <p className="text-muted-foreground mt-2 text-sm italic">
          {TRAINING_QUOTE}
        </p>
      </div>
      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-foreground text-sm font-semibold">
          At deployment — satiated
        </p>
        <p className="text-muted-foreground mt-2 text-sm italic">
          {DEPLOYMENT_QUOTE}
        </p>
      </div>
    </div>
  );
}
