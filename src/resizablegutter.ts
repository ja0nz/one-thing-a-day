import { fromDOMEvent, merge } from "@thi.ng/rstream";
import * as tx from "@thi.ng/transducers";

const guttercell = document.getElementById("r1c1") as HTMLElement;

/**
 * Creates a Stream<MouseEvent> dispatched on mousedown events
 * upon activation
 * - the mouse target is set with an zIndex
 * - the global CSS value is set (activating an ::after element)
 */
const activateEvent = fromDOMEvent(guttercell, "mousedown")
  .subscribe({
    next(event: MouseEvent) {
      event.target.style.zIndex = "1";
      document.documentElement.style.setProperty(
        "--toggle-capture-zone",
        "block"
      );
    },
  })
  .transform(
    tx.map((ev: MouseEvent) => ev.target.parentElement), // get hosting grid
    tx.map(getComputedStyle), // get CSSStyleDeclaration
    tx.multiplexObj({
      rows: tx.pluck("gridTemplateRows"), //get rows: "1px 12px 12px"
      columns: tx.pluck("gridTemplateColumns"), // get columns: "1px 12px 12px"
    }),
    tx.mapVals((x: string) => x.split("px")), // split "px" string: ["1" "12" "12" ""]
    tx.mapVals((xs: string[]) => xs.filter((x) => x!!)), // filter empty split: ["1" "12" "12"]
    tx.mapVals((xs: string[]) => xs.map(Number)) // map px values to numbers: [1 12 12]
  );

/**
 * Creates a StreamMerge<MouseEvent> dispatched on mouseup/mouseleave events
 * for reverting the activationEvent
 * - the mouse targets zIndex is reset
 * - the global CSS value is reset
 */
merge({
  src: [
    fromDOMEvent(guttercell, "mouseup"),
    fromDOMEvent(guttercell, "mouseleave"),
  ],
}).subscribe({
  next(event: MouseEvent) {
    event.target.style.zIndex = "";
    document.documentElement.style.setProperty("--toggle-capture-zone", "none");
  },
});

/**
 * Creates a Stream<MouseEvent> dispatched on mousemove events
 * for adjusting the parent grid rows/columns measures
 * - the HTML data- values are read
 * - the activationEvent transforemed seed data is derefed
 * - the templateRows and templateColumns are adjusted by mouse movement
 */
fromDOMEvent(guttercell, "mousemove").subscribe({
  next(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // zIndex set to "1" if activated by activateStream
    if (!!target.style.zIndex) {
      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      const { columns, rows } = activateEvent.deref(); // IMPURE

      // Y axis
      columns[col - 1] = columns[col - 1] + event.movementX;
      columns[col + 1] = columns[col + 1] - event.movementX;
      target.parentElement.style.gridTemplateColumns = columns
        .map((x: number) => `${x}px`)
        .join(" ");

      // X axis
      rows[row - 1] = rows[row - 1] + event.movementY;
      rows[row + 1] = rows[row + 1] - event.movementY;
      target.parentElement.style.gridTemplateRows = rows
        .map((x: number) => `${x}px`)
        .join(" ");
    }
  },
});
