import * as tx from "@thi.ng/transducers";
import { CodeJar } from "codejar";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

const rnode = document.getElementById("r1c1");
rnode?.addEventListener("mousedown", resizeByNeighborIndex(rnode.dataset));
function resizeByNeighborIndex({ row = 0, col = 0 }) {
  row = Number(row);
  col = Number(col);

  return (ev: MouseEvent) => {
    const resizetarget = ev.target as HTMLElement;
    const gridparent = resizetarget.parentElement!;

    const xRulesToArray = tx.comp(
      tx.mapcat((x: string) => x.split("px")),
      tx.map((x: string) => Number(x)),
      tx.filter((x: number) => x !== 0)
    );
    const rows = tx.step(tx.comp(tx.pluck("gridTemplateRows"), xRulesToArray))(
      getComputedStyle(gridparent)
    ) as number[];

    const columns = tx.step(
      tx.comp(tx.pluck("gridTemplateColumns"), xRulesToArray)
    )(getComputedStyle(gridparent)) as number[];

    // Resize block
    function _resize(ev: MouseEvent) {
      // X --
      columns[col - 1] = columns[col - 1] + ev.movementX;
      columns[col + 1] = columns[col + 1] - ev.movementX;
      gridparent.style.gridTemplateColumns = columns
        .map((x) => String(x) + "px")
        .join(" ");

      // Y |
      rows[row - 1] = rows[row - 1] + ev.movementY;
      rows[row + 1] = rows[row + 1] - ev.movementY;
      gridparent.style.gridTemplateRows = rows
        .map((x) => String(x) + "px")
        .join(" ");
    }

    // Set up resize event
    resizetarget.addEventListener("mousemove", _resize);
    resizetarget.style.zIndex = "1";
    document.documentElement.style.setProperty(
      "--toggle-capture-zone",
      "block"
    );

    // Cleanup block
    function _cleanup() {
      resizetarget.removeEventListener("mousemove", _resize);
      resizetarget.style.zIndex = "";
      document.documentElement.style.setProperty(
        "--toggle-capture-zone",
        "none"
      );
      // Remove self
      resizetarget.removeEventListener("mouseup", _cleanup);
      resizetarget.removeEventListener("mouseleave", _cleanup);
    }

    resizetarget.addEventListener("mouseup", _cleanup);
    resizetarget.addEventListener("mouseleave", _cleanup);
  };
}

// Code Editor Section
Prism.manual = true;
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
  // Cleanup
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.deleteContents();
  // END Cleanup
  editor.append(fragment);
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
