import * as tx from "@thi.ng/transducers";

const grid = document.getElementById("grid");
const rnode = document.getElementById("r1c1");
if (rnode !== null) {
  rnode.addEventListener("mousedown", resizeByNeighborIndex(rnode.dataset));
}

function resizeByNeighborIndex({ row = 0, col = 0 }) {
  row = Number(row);
  col = Number(col);

  return (ev: MouseEvent) => {
    const xRulesToArray = tx.comp(
      tx.mapcat((x: string) => x.split("px")),
      tx.map((x: string) => Number(x)),
      tx.filter((x: number) => x !== 0)
    );
    const rows: number[] = tx.transduce(
      tx.comp(tx.pluck("gridTemplateRows"), xRulesToArray),
      tx.push(),
      Array(grid)
    );
    const columns: number[] = tx.transduce(
      tx.comp(tx.pluck("gridTemplateColumns"), xRulesToArray),
      tx.push(),
      Array(getComputedStyle(grid))
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
    const target = ev.target as HTMLElement;
    target.addEventListener("mousemove", _resize);
    target.style.zIndex = "1";
    document.documentElement.style.setProperty(
      "--toggle-capture-zone",
      "block"
    );

    // Cleanup
    function _cleanup() {
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
