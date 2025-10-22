import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
    build: {
        outDir: "dist",
        target: "esnext",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            name: "index",
            fileName: "index"
        }
    },
    plugins: [dts({ bundleTypes: true })]
});
