import { build, type InlineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import fg from "fast-glob"
import path from "path"
import fs from "fs"
import tailwindcss from "@tailwindcss/vite"

const htmlName = "index.html"
const htmlRootName = "container"
const entryFileName = "src/main.tsx"
const outDir = "dist"

// Pages to generate separate HTML files for MCP resources
const PAGES = [
    { name: "claims", route: "/claims" },
    { name: "find-doctor", route: "/find-doctor" },
    { name: "doctor-search", route: "/doctor-search" },
    { name: "plan-benefits", route: "/plan-benefits" },
    { name: "prescriptions", route: "/prescriptions" },
]

const PER_ENTRY_CSS_GLOB = "**/*.{css,pcss,scss,sass}"
const PER_ENTRY_CSS_IGNORE = "**/*.module.*".split(",").map(s => s.trim())
const GLOBAL_CSS_LIST = [path.resolve("src/index.css")]

/**
 * Generate the initial route script for MCP resources
 * NOTE: We only inject the route, NOT mock data.
 * OpenAI will inject the real window.openai with toolOutput when the widget loads.
 */
function generateRouteScript(route: string): string {
    return `<script>
  // Initial route for this MCP resource
  // OpenAI will inject window.openai with actual tool output
  window.__INITIAL_ROUTE__ = '${route}';
</script>`
}

function wrapEntryPlugin(
    virtualId: string,
    entryFile: string,
    cssPaths: string[]
): Plugin {
    return {
        name: `virtual-entry-wrapper:${entryFile}`,
        resolveId(id) {
            if (id === virtualId) return id
        },
        load(id) {
            if (id !== virtualId) {
                return null
            }

            const cssImports = cssPaths
                .map(css => `import ${JSON.stringify(css)}`)
                .join("\n")

            return `
${cssImports}
export * from ${JSON.stringify(entryFile)}

import * as __entry from ${JSON.stringify(entryFile)}
export default (__entry.default ?? __entry.App)

import ${JSON.stringify(entryFile)}
`
        },
    }
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const builtName = path.basename(path.dirname(entryFileName))
const entryAbs = path.resolve(entryFileName)
const entryDir = path.dirname(entryAbs)

// Global CSS (Tailwind, etc.), only include those that exist
const globalCss = GLOBAL_CSS_LIST.filter(p => fs.existsSync(p))

const perEntryCss = fg
    .sync(PER_ENTRY_CSS_GLOB, {
        cwd: entryDir,
        absolute: true,
        dot: false,
        ignore: PER_ENTRY_CSS_IGNORE,
    })
    .filter(p => !globalCss.includes(p))

// Final CSS list (global first for predictable cascade)
const cssToInclude = [...globalCss, ...perEntryCss].filter(p =>
    fs.existsSync(p)
)

const virtualId = `\0virtual-entry:${entryAbs}`

const createConfig = (): InlineConfig => ({
    plugins: [
        wrapEntryPlugin(virtualId, entryAbs, cssToInclude),
        tailwindcss(),
        react(),
        {
            name: "remove-manual-chunks",
            outputOptions(options) {
                if ("manualChunks" in options) {
                    delete (options as any).manualChunks
                }
                return options
            },
        },
    ],
    root: process.cwd(),
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
        target: "es2022",
    },
    build: {
        target: "es2022",
        outDir,
        emptyOutDir: false,
        chunkSizeWarningLimit: 2000,
        minify: "esbuild",
        cssCodeSplit: false,
        rollupOptions: {
            input: virtualId,
            output: {
                format: "es",
                entryFileNames: `${builtName}.js`,
                inlineDynamicImports: true,
                assetFileNames: info => {
                    const name = info.names[0]
                    const modified =
                        (name || "").endsWith(".css")
                            ? `${name}`
                            : "[name]-[hash][extname]"
                    return modified
                },
            },
            preserveEntrySignatures: "allow-extension",
            treeshake: true,
        },
    },
})

console.log(`Building ${builtName} (react)`)
await build(createConfig())
console.log(`Built ${builtName}`)

// css get renamed sometimes
const cssPaths = fg.sync(`${outDir}/**/*.css`)
const jsPaths = fg.sync(`${outDir}/**/*.js`)

let cssBlock: string = ""

for (const cssPath of cssPaths) {
    const css = fs.existsSync(cssPath)
        ? fs.readFileSync(cssPath, { encoding: "utf8" })
        : ""
    cssBlock = cssBlock + (css ? `\n<style>\n${css}\n</style>\n` : "")
}

let jsBlock: string = ""

for (const jsPath of jsPaths) {
    const js = fs.existsSync(jsPath)
        ? fs.readFileSync(jsPath, { encoding: "utf8" })
        : ""
    jsBlock = jsBlock + (js ? `\n<script type="module">\n${js}\n</script>` : "")
}

// Generate base index.html (landing page, no route injection)
const baseHtml = [
    "<!doctype html>",
    "<html>",
    `<head>${cssBlock}</head>`,
    "<body>",
    `  <div id="${htmlRootName}"></div>${jsBlock}`,
    "</body>",
    "</html>",
].join("\n")

const htmlPath = path.join(outDir, htmlName)
fs.writeFileSync(htmlPath, baseHtml, { encoding: "utf8" })
console.log(`${htmlPath} (generated - landing page)`)

// Generate page-specific HTML files with route injection only
// OpenAI injects window.openai with actual tool output when serving as MCP resource
for (const page of PAGES) {
    const routeScript = generateRouteScript(page.route)

    const pageHtml = [
        "<!doctype html>",
        "<html>",
        `<head>${cssBlock}</head>`,
        "<body>",
        `  ${routeScript}`,
        `  <div id="${htmlRootName}"></div>${jsBlock}`,
        "</body>",
        "</html>",
    ].join("\n")

    const pageHtmlPath = path.join(outDir, `${page.name}.html`)
    fs.writeFileSync(pageHtmlPath, pageHtml, { encoding: "utf8" })
    console.log(`${pageHtmlPath} (generated for route: ${page.route})`)
}

console.log(`\nGenerated ${PAGES.length + 1} HTML files for MCP resources`)
console.log("\nNote: These HTML files are for MCP resource serving.")
console.log("OpenAI will inject window.openai with actual tool output.")
console.log("For local dev testing, use: npm run dev (with DevToolbar)")
