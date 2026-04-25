import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const componentsDir = resolve(__dirname, "src/components");
const componentsUiDir = resolve(__dirname, "src/components/ui");
const landingComponentsDir = resolve(__dirname, "src/components/landing");

// Read the directory entries and filter for directories that contain an index.ts file
const getDirectoryEntries = (baseDir: string) => Object.fromEntries(
    readdirSync(baseDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => [entry.name, resolve(baseDir, entry.name, "index.ts")])
        .filter(([, entryPath]) => existsSync(entryPath))
);

// Dynamically generate library entries for each dedicated component entrypoint
function getLibraryEntries() {
    // Get entries for top-level components
    const topLevelComponentEntries = Object.fromEntries(
        Object.entries(getDirectoryEntries(componentsDir))
            .filter(([entryName]) => entryName !== "ui")
    );

    // Get entries for UI components
    const uiComponentEntries = getDirectoryEntries(componentsUiDir);

    // Get dedicated entries for landing subcomponents
    const landingComponentEntries = getDirectoryEntries(landingComponentsDir);

    // Add dedicated component entries plus shared utility and stylesheet entries
    return {
        ...topLevelComponentEntries,
        ...uiComponentEntries,
        ...landingComponentEntries,
        i18n: resolve(__dirname, "src/lib/i18n.ts"),
        style: resolve(__dirname, "src/style.ts"),
        utils: resolve(__dirname, "src/lib/utils.ts")
    };
}

// Export the Vite configuration
export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            include: ["src/**/*"],
            entryRoot: "src",
            outDir: "dist",
            strictOutput: true
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
            entry: getLibraryEntries(),
            name: "ThemeVintage",
            formats: ["es"],
            fileName: (_, entryName) => `${entryName}.js`
        },
        rollupOptions: {
            external: ["vue", "vue-i18n"]
        }
    }
});