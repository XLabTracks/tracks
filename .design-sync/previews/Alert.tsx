import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
} from "tracks";
import { CircleCheck, Info, OctagonX } from "lucide-react";

export const Default = () => (
  <Alert className="w-[26rem]">
    <Info />
    <AlertTitle>Previewing while signed out</AlertTitle>
    <AlertDescription>
      Your progress isn&apos;t being saved. Sign in to keep checkmarks and
      review cards across sessions.
    </AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive" className="w-[26rem]">
    <OctagonX />
    <AlertTitle>Submission failed</AlertTitle>
    <AlertDescription>
      We couldn&apos;t reach the grader. Your draft is saved — try submitting
      again in a minute.
    </AlertDescription>
  </Alert>
);

export const WithAction = () => (
  <Alert className="w-[26rem]">
    <CircleCheck />
    <AlertTitle>Lesson marked complete</AlertTitle>
    <AlertDescription>
      This module is now 3 of 5 lessons done.
    </AlertDescription>
    <AlertAction>
      <Button variant="outline" size="xs">
        Undo
      </Button>
    </AlertAction>
  </Alert>
);
