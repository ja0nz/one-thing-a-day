module.exports = {
  plugins: [
    require("postcss-windicss")({
      touchMode: "utime",
    }),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
