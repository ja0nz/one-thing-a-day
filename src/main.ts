/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
export const foo = async (): Promise<boolean> => {
  console.log(greet("World"));
  await delayMillis(1000);
  console.log("done");
  return true;
};

export const delayMillis = (delayMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export const greet = (name: string): string =>
  (`Hello ${name}`(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window as any
  ).foo = foo); // instead of casting window to any, you can extend the Window interface: https://stackoverflow.com/a/43513740/5433572

console.log(
  'Method "foo" was added to the window object. You can try it yourself by just entering "await foo()"'
);
