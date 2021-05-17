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

thingJar.updateCode(thingStar);
htmlJar.updateCode(thingHtml);

const evaluateBtn = document.getElementById("evaluate") as HTMLElement;
const evaluateArea = document.getElementById("evaluated-thing") as HTMLElement;
const esbuild = initialize({
  wasmURL: "./esbuild-wasm/esbuild.wasm",
});

sync({
  src: [fromPromise(esbuild), fromDOMEvent(evaluateBtn, "click")],
}).subscribe({
  next() {
    const prelude = htmlEditor.textContent;
    const main = thingEditor.textContent;
    const esbuildTransform = (textContent: string) =>
      transform(textContent, { loader: "ts", format: "esm" });

    sync({
      src: [
        fromPromise(esbuildTransform(prelude)),
        fromPromise(esbuildTransform(main)),
      ],
      xform: tx.comp(
        tx.mapVals(
          (x) => new Blob([x.code], { type: "application/javascript" })
        ),
        tx.mapVals((x) => URL.createObjectURL(x))
      ),
    }).subscribe({
      next(blobs) {
        const [htmlBlob, thingBlob] = Object.values(blobs);
        fromPromise(import(htmlBlob))
          .transform(
            tx.pluck("default"),
            tx.map(serialize),
            tx.map((htmlString) =>
              document.createRange().createContextualFragment(htmlString)
            )
          )
          .subscribe({
            next(fragment) {
              evaluateArea.replaceChildren(fragment);
              import(thingBlob);
            },
          });
      },
    });
  },
});
