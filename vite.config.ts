import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            include: ["src/**/*"],
            insertTypesEntry: true
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")
        }
    },
    build: {
        minify: false,
        lib: {
            entry: {
                index: resolve(__dirname, "src/index.ts"),
                alert: resolve(__dirname, "src/components/ui/alert/index.ts"),
                "alert-dialog": resolve(__dirname, "src/components/ui/alert-dialog/index.ts"),
                busy: resolve(__dirname, "src/components/ui/busy/index.ts"),
                button: resolve(__dirname, "src/components/ui/button/index.ts"),
                card: resolve(__dirname, "src/components/ui/card/index.ts"),
                command: resolve(__dirname, "src/components/ui/command/index.ts"),
                dialog: resolve(__dirname, "src/components/ui/dialog/index.ts"),
                field: resolve(__dirname, "src/components/ui/field/index.ts"),
                input: resolve(__dirname, "src/components/ui/input/index.ts"),
                label: resolve(__dirname, "src/components/ui/label/index.ts"),
                popover: resolve(__dirname, "src/components/ui/popover/index.ts"),
                select: resolve(__dirname, "src/components/ui/select/index.ts"),
                separator: resolve(__dirname, "src/components/ui/separator/index.ts"),
                sheet: resolve(__dirname, "src/components/ui/sheet/index.ts"),
                sidebar: resolve(__dirname, "src/components/ui/sidebar/index.ts"),
                skeleton: resolve(__dirname, "src/components/ui/skeleton/index.ts"),
                slider: resolve(__dirname, "src/components/ui/slider/index.ts"),
                switch: resolve(__dirname, "src/components/ui/switch/index.ts"),
                tooltip: resolve(__dirname, "src/components/ui/tooltip/index.ts"),
                utils: resolve(__dirname, "src/lib/utils.ts")
            },
            name: "ThemeVintage",
            formats: ["es"],
            fileName: (_, entryName) => `${entryName}.js`
        },
        rollupOptions: {
            external: ["vue"],
        }
    }
});