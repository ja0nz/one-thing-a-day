import * as tx from "@thi.ng/transducers";
import { illegalArgs } from "@thi.ng/errors";

(window as any).tx = tx;
(window as any).illegalArgs = illegalArgs;

const grid = document.getElementById("grid")!;
const rnode = document.getElementById("r1c1")!;
if (rnode && grid !== null) {
  rnode.addEventListener("mousedown", resizeByNeighborIndex(rnode.dataset));
}

function resizeByNeighborIndex({ row = 0, col = 0 }) {
  row = Number(row);
  col = Number(col);

  return (ev: MouseEvent) => {
    const xCssDeclarations = tx.comp(
      tx.map((x) => (x === null ? illegalArgs("Grid is null") : x)),
      tx.map(getComputedStyle)
    );

    const xRulesToArray = tx.comp(
      tx.mapcat((x) => x.split("px")),
      tx.map((x) => Number(x)),
      tx.filter((x) => x !== 0)
    );
    const rows: number[] = tx.transduce(
      tx.comp(xCssDeclarations, tx.pluck("gridTemplateRows"), xRulesToArray),
      tx.push(),
      Array(grid)
    );
    const columns: number[] = tx.transduce(
      tx.comp(xCssDeclarations, tx.pluck("gridTemplateColumns"), xRulesToArray),
      tx.push(),
      Array(grid)
    );

    function _resize(ev: MouseEvent) {
      // X --
      columns[col - 1] = columns[col - 1] + ev.movementX;
      columns[col + 1] = columns[col + 1] - ev.movementX;
      grid.style.gridTemplateColumns = columns
        .map((x) => String(x) + "px")
        .join(" ");

      // Y // |
      rows[row - 1] = rows[row - 1] + ev.movementY;
      rows[row + 1] = rows[row + 1] - ev.movementY;
      grid.style.gridTemplateRows = rows.map((x) => String(x) + "px").join(" ");
    }

    // Set up resize event
    const target: HTMLElement = ev.target;
    target.addEventListener("mousemove", _resize);
    target.style.zIndex = "1";
    document.documentElement.style.setProperty(
      "--toggle-capture-zone",
      "block"
    );

    // Cleanup
    function _cleanup(ev) {
      target.removeEventListener("mousemove", _resize);
      target.style.zIndex = "";
      document.documentElement.style.setProperty(
        "--toggle-capture-zone",
        "none"
      );
      // Remove self
      target.removeEventListener("mouseup", _cleanup);
      target.removeEventListener("mouseleave", _cleanup);
    }

    target.addEventListener("mouseup", _cleanup);
    target.addEventListener("mouseleave", _cleanup);
  };
}
/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
// export const foo = async (): Promise<boolean> => {
//   console.log(greet("World"));
//   await delayMillis(1000);
//   console.log("done");
//   return true;
// };

// export const delayMillis = (delayMs: number): Promise<void> =>
//   new Promise((resolve) => setTimeout(resolve, delayMs));

// export const greet = (name: string): string =>
//   (`Hello ${name}`(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     window as any
//   ).foo = foo); // instead of casting window to any, you can extend the Window interface: https://stackoverflow.com/a/43513740/5433572

// console.log(
//   'Method "foo" was added to the window object. You can try it yourself by just entering "await foo()"'
// );
