import { serialize } from "@thi.ng/hiccup";
import { fromDOMEvent, fromPromise, sync } from "@thi.ng/rstream";
import * as tx from "@thi.ng/transducers";
import { CodeJar } from "codejar";
import { initialize, transform } from "esbuild-wasm";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "./resizablegutter";
import { thingHtml, thingStar } from "./seeddata";

// Set manual highlighting
Prism.manual = true; // no automatic highlighting

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
