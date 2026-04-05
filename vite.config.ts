import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            include: ["src/**/*"],
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "ThemeVintage",
            formats: ["es"],
            fileName: () => "index.js",
        },
        rollupOptions: {
            external: ["vue"],
        },
    },
});