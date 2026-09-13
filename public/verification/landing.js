/* The skill web is drawn by skill-web.js, the renderer this band shares with
   /verification/map — the same figure on both pages, by construction. This
   page mounts it plain: no progress, no filters beyond the module chips, the
   map page carries the rest. */

(function () {
  if (window.VTSkillWeb) VTSkillWeb.mount();
})();
/* ---------------------------------------------------------------------------
   The page around the constellation. Every number and card below is read from
   data/course.js and data/skills.js, so a new unit or module appears here on
   its own — nothing about the course is written into this file.

   Trap: the hero's primary button is the learner's next incomplete unit, which
   means it depends on the progress store. Read it through VT, never from
   localStorage directly, or the two disagree after a reset.
--------------------------------------------------------------------------- */

(function () {
  var C = window.COURSE, VT = window.VT;
  if (!C || !VT) return;

  VT.mountChrome('/verification/landing');
  VT.mountFoot();

  /* The hero's two ways in and its stat row are written in landing.html and
     stay there. They are the course's pitch, not a readout of this browser's
     progress — a returning learner picks up from the track page. */

})();
