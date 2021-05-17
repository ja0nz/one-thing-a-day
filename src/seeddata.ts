const thingStar = `
import { star } from 'https://cdn.skypack.dev/@thi.ng/geom';
import { start } from 'https://cdn.skypack.dev/@thi.ng/hdom';
import { convertTree } from 'https://cdn.skypack.dev/@thi.ng/hiccup-svg';
import { serialize } from 'https://cdn.skypack.dev/@thi.ng/hiccup';
import { map, range } from 'https://cdn.skypack.dev/@thi.ng/transducers'

const a = () => {
  const t = Date.now() * 3e-3;
  return ["g", {fill: "none", stroke: "black"},
         ...map((i) => star(i * 10,3,[0.5 + Math.sin(t) * 0.1 + i * 0.05, 1]), range(1,10))];
};

const root = () => ["svg", { width: 300, height: 300, viewBox: "-100 -100 200 200" }, convertTree(a())];
start(root);`;

const thingHtml = `
// HTML Hiccup Editor - This is going to be evaluated first
import { tw } from "https://cdn.skypack.dev/twind";
const app = [
  "main",
  { class: tw\`h-screen bg-purple-400 flex items-center justify-center\` },
  [
    "h1",
    { class: tw\`font-bold text(center 5xl white sm:gray-800 md:pink-700)\` },
    "This is Twind!",
  ],
  [ "div#app" ]
];
export default app;`;

export { thingStar, thingHtml };
