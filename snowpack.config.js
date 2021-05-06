// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  exclude: ["**/node_modules/**/*", "**/src/eval.ts"],
  plugins: ["@snowpack/plugin-typescript", "@snowpack/plugin-postcss"],
  packageOptions: {
    types: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
