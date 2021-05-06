import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["public/**/*.html"],
  },
});
