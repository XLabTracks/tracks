import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "tracks";

export const Faq = () => (
  <Accordion type="single" collapsible defaultValue="progress" className="w-96">
    <AccordionItem value="progress">
      <AccordionTrigger>How is progress tracked?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Each lesson and paper counts as one unit. A module shows complete once
        every unit is done.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="review">
      <AccordionTrigger>What goes into my review queue?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Prompts you rate inside lessons are scheduled for spaced review. Due
        cards appear on the Review tab.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="assessments">
      <AccordionTrigger>Do assessments gate completion?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        No. End-of-module assessments never block progress through a track.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Multiple = () => (
  <Accordion type="multiple" defaultValue={["grading", "classrooms"]} className="w-96">
    <AccordionItem value="grading">
      <AccordionTrigger>Written-response grading</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Submit a written response to request grader feedback on it.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="classrooms">
      <AccordionTrigger>Classrooms</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Instructors can share one grading key with every classroom member.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="keys">
      <AccordionTrigger>Bring your own key</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Stored keys are encrypted and only ever used server-side.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
