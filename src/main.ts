import { fromDOMEvent, merge } from "@thi.ng/rstream";
import * as tx from "@thi.ng/transducers";
import { CodeJar } from "codejar";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
Prism.manual = true; // no automatic highlighting

// Grid settings
const rnode = document.getElementById("r1c1") as HTMLElement;
const activateEvent = fromDOMEvent(rnode, "mousedown")
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

// deactivateEvent - set zIndex and toggle CSS
merge({
  src: [fromDOMEvent(rnode, "mouseup"), fromDOMEvent(rnode, "mouseleave")],
}).subscribe({
  next(event: MouseEvent) {
    event.target.style.zIndex = "";
    document.documentElement.style.setProperty("--toggle-capture-zone", "none");
  },
});

// resizeEvent (by mouseover) - alter grid parent Rows and Columns
fromDOMEvent(rnode, "mousemove").subscribe({
  next(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // zIndex set to "1" if activated by activateStream
    if (!!target.style.zIndex) {
      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      const { columns, rows } = activateEvent.deref(); // IMPURE

      // X --
      columns[col - 1] = columns[col - 1] + event.movementX;
      columns[col + 1] = columns[col + 1] - event.movementX;
      target.parentElement.style.gridTemplateColumns = columns
        .map((x: number) => `${x}px`)
        .join(" ");

      // Y |
      rows[row - 1] = rows[row - 1] + event.movementY;
      rows[row + 1] = rows[row + 1] - event.movementY;
      target.parentElement.style.gridTemplateRows = rows
        .map((x: number) => `${x}px`)
        .join(" ");
    }
  },
});

// Code Editor Section
const codeJarOpts = {
  tab: " ".repeat(4), // default is '\t'
};

/**
 * Called on each change in code window
 * Transforming raw {JS,TS} strings to formatted HTML Strings
 * */
const codeJarHighlight = (editor: HTMLElement) => {
  const highlight = Prism.highlight(
    editor.textContent as string,
    Prism.languages.typescript,
    "typescript"
  );
  const fragment = document.createRange().createContextualFragment(highlight);
  editor.replaceChildren(fragment);
};

// Thing editor
const thingEditor = document.getElementById("thing-editor") as HTMLElement;
const thingJar = CodeJar(thingEditor, codeJarHighlight, codeJarOpts);

// HTML editor
const htmlEditor = document.getElementById("html-editor") as HTMLElement;
const htmlJar = CodeJar(htmlEditor, codeJarHighlight, codeJarOpts);

// jar.updateCode(`
// let foo: number = 42;
// for (let x in y) {
// console.log('foo')
// }`);

// Listen to updates
//jar.onUpdate((code) => {
//  console.log(code);
//});
