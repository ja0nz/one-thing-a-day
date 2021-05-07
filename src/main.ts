import * as tx from "@thi.ng/transducers";

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
