import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "tracks";

export const TrackCard = () => (
  <Card className="shadow-soft w-80">
    <CardHeader>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Technical</Badge>
      </div>
      <CardTitle className="mt-2 text-xl">Control</CardTitle>
      <CardDescription>
        Monitoring, auditing, and the control game — what keeps a capable
        model from causing harm even if it tries.
      </CardDescription>
    </CardHeader>
    <CardContent className="text-muted-foreground text-sm">
      4 modules · ~12h
    </CardContent>
    <CardFooter>
      <Button className="w-full">Open track</Button>
    </CardFooter>
  </Card>
);

export const WithAction = () => (
  <Card className="w-96">
    <CardHeader>
      <CardTitle>Module progress</CardTitle>
      <CardDescription>3 of 5 lessons complete</CardDescription>
      <CardAction>
        <Button variant="ghost" size="sm">
          Resume
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="text-sm">
      Next up: a written response on monitoring protocols. Submissions are
      graded on reasoning transparency, not conclusions.
    </CardContent>
  </Card>
);

export const TextHeavy = () => (
  <Card className="w-[28rem]">
    <CardHeader>
      <CardTitle>Why writing practice?</CardTitle>
      <CardDescription>From the course orientation</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3 text-sm leading-relaxed">
      <p>
        Reading about safety arguments is not the same as being able to make
        one. Each module ends with a short written assessment so you practice
        constructing the argument yourself, under the same constraints
        researchers face: limited evidence, real trade-offs, and a reader who
        will check your reasoning.
      </p>
      <p className="text-muted-foreground">
        Feedback focuses on the transparency of your reasoning — whether a
        careful reader can follow every step — rather than on whether you
        reached a particular conclusion.
      </p>
    </CardContent>
  </Card>
);
