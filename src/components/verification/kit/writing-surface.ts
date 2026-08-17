/**
 * One rectangle per written answer.
 *
 * Every constructed-answer field in the course is a card holding a label and a
 * place to write. The place to write paints nothing: the card it sits in is
 * already the box, and a bordered, filled textarea inside a bordered, filled
 * card is two rectangles standing for one field — which is what it looks like,
 * a panel with a hole cut in it.
 *
 * So the card keeps the border and the ground, and the writing area is bare
 * text on it. Three consequences, and they are the whole reason these are
 * constants rather than a class string copied into fourteen places:
 *
 * - **The focus ring moves out one level.** theme.css gives every focused
 *   textarea `outline: 2px solid var(--ring)`, which on a bare writing area
 *   draws back exactly the second rectangle this removes. The indicator is not
 *   dropped — it cannot be, it is how a keyboard says where it is — it is
 *   taken off the textarea and put on the card, which is now the field. Both
 *   halves are required: a `writingArea` without `writingCardFocus` on its
 *   card is a field that never says it has focus.
 *   Trap: that outline needs the important flag to lift, and not because of
 *   specificity — theme.css is an ordinary stylesheet, so its rules are
 *   unlayered and outrank every Tailwind utility whatever the selector says.
 *   The `!` is the same escape hatch Fold carries for the same stylesheet.
 * - `focus-within`, not `focus-visible`, because the card is not the focus
 *   target. It behaves the same here: a text field matches `:focus-visible`
 *   on a mouse click too, unlike a button.
 * - `resize-y`, not the UA default of `both`: a textarea that can be dragged
 *   wider than the card it lives in tears the card open.
 */

/** Added to the card that holds a writing area. Required beside `writingArea`. */
export const writingCardFocus =
  "focus-within:ring-2 focus-within:ring-[var(--ring)] transition-shadow";

/** The writing area itself — bare text on the card's own ground. */
export const writingArea =
  "mt-2 w-full resize-y border-0 bg-transparent p-0 text-sm leading-relaxed outline-none! focus-visible:outline-none!";
