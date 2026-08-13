import { Tabs, TabsContent, TabsList, TabsTrigger } from "tracks";

export const Default = () => (
  <Tabs defaultValue="lessons" className="w-96">
    <TabsList>
      <TabsTrigger value="lessons">Lessons</TabsTrigger>
      <TabsTrigger value="exercises">Exercises</TabsTrigger>
      <TabsTrigger value="resources">Resources</TabsTrigger>
    </TabsList>
    <TabsContent value="lessons" className="text-muted-foreground text-sm">
      Five lessons, each pairing a reading with an interactive demo.
    </TabsContent>
    <TabsContent value="exercises" className="text-muted-foreground text-sm">
      Practice exercises with instant feedback.
    </TabsContent>
    <TabsContent value="resources" className="text-muted-foreground text-sm">
      Papers, talks, and tools referenced in this module.
    </TabsContent>
  </Tabs>
);

export const LineVariant = () => (
  <Tabs defaultValue="draft" className="w-96">
    <TabsList variant="line">
      <TabsTrigger value="draft">Draft</TabsTrigger>
      <TabsTrigger value="submitted">Submitted</TabsTrigger>
      <TabsTrigger value="graded">Graded</TabsTrigger>
    </TabsList>
    <TabsContent value="draft" className="text-muted-foreground text-sm">
      Your response autosaves as you write.
    </TabsContent>
    <TabsContent value="submitted" className="text-muted-foreground text-sm">
      Submitted responses are locked while grading runs.
    </TabsContent>
    <TabsContent value="graded" className="text-muted-foreground text-sm">
      The grader report appears here once ready.
    </TabsContent>
  </Tabs>
);
