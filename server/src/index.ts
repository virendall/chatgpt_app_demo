import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express, { Request, Response } from 'express'
import { z } from 'zod'
import { readFileSync } from "fs"
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { error } from 'console'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 3000

const VERSION = "1.0.0"
const BASE_RESOURCE_URI = "ui://widget/pokemon-board.html"
const RESOURCE_URL = `${BASE_RESOURCE_URI}?version=${VERSION}`

const RESOURCE_MIME_TYPE = "text/html+skybridge"

const HTML_PATH = join(__dirname, "..", "..", "web/dist/index.html")
const HTML = readFileSync(HTML_PATH, "utf8")


/****************************/
/******** MCP Server ********/
/****************************/

const server = new McpServer({
    name: 'pokemon-server',
    version: '1.0.0',
}, {
    capabilities: {},
})


export const StructuredOutput = z.object({
    name: z.string({ description: "Pokemon name." }),
    id: z.number({ description: "Pokemon index id." }).int(),
    height: z.number({ description: "Pokemon height." }).int(),
    weight: z.number({ description: "Pokemon weight." }).int(),
    types: z.array(
        z.object({
            slot: z.number().int(),
            type: z.object({
                name: z.string({ description: "type name." }),
                url: z.string({ description: "URL to get type detail." }).url(),
            })
        })
    )
})
type StructuredOutput = z.infer<typeof StructuredOutput>;


export const OutputMeta = z.object({
    sprites: z.object({
        back_default: z.string({ description: "URL to get type back_default image." }).url().nullable(),
        back_female: z.string({ description: "URL to get type back_female image." }).url().nullable(),
        back_shiny: z.string({ description: "URL to get type back_shiny image." }).url().nullable(),
        back_shiny_female: z.string({ description: "URL to get type back_shiny_female image." }).url().nullable(),
        front_default: z.string({ description: "URL to get type front_default image." }).url().nullable(),
        front_female: z.string({ description: "URL to get type front_female image." }).url().nullable(),
        front_shiny: z.string({ description: "URL to get type front_shiny image." }).url().nullable(),
        front_shiny_female: z.string({ description: "URL to get type front_shiny_female image." }).url().nullable(),
    }, { description: "URLs to get pokmeon images." })
})
type OutputMeta = z.infer<typeof OutputMeta>;



// Add list pokemons tool
server.registerTool(
    'get_pokemon',
    {
        title: 'Get Pokemon',
        description: 'Get detail infomation of a pokemon.',
        _meta: {
            "openai/outputTemplate": RESOURCE_URL,
            "openai/toolInvocation/invoking": "Invoking...",
            "openai/toolInvocation/invoked": "Invoked!",
            // Allow component-initiated tool access: https://developers.openai.com/apps-sdk/build/mcp-server#%23%23allow-component-initiated-tool-access
            "openai/widgetAccessible": true
        },
        inputSchema: { name: z.string({ description: "The name of the pokemon to get detail for." }).nonempty() },
        outputSchema: {
            result: StructuredOutput
        }
    },
    async ({ name }) => {
        if (name.length == 0) {
            throw new Error("Pokemon name cannot be empty.")
        }
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

        if (!response.ok) {
            throw new Error(`HTTP error. status: ${response.status}`)
        }

        const json = await response.json()
        const structuredOutput: StructuredOutput = StructuredOutput.parse(json)
        const structuredContent = {
            result: structuredOutput
        }
        const meta: OutputMeta = OutputMeta.parse(json)
        return {
            content: [
                { type: 'text', text: JSON.stringify(structuredContent) },
            ],
            structuredContent: structuredContent,
            // The _meta property/parameter is reserved by MCP to allow clients and servers to attach additional metadata to their interactions.
            // This allows us to define Arbitrary JSON passed only to the component.
            // Use it for data that should not influence the model’s reasoning, like the full set of locations that backs a dropdown.
            // // _meta is never shown to the model.
            _meta: meta
        }
    }
)


// UI resource (no inline data assignment; host will inject data)
server.registerResource(
    "pokemon-widget",
    RESOURCE_URL,
    {},
    async () => ({
        contents: [
            {
                uri: RESOURCE_URL,
                mimeType: RESOURCE_MIME_TYPE,
                text: HTML,
            },
        ],
    })
)


/********************************/
/******** Express Server ********/
/********************************/


// Set up Express and HTTP transport
const app = express()
app.use(express.json())

app.post('/mcp', async (req: Request, res: Response) => {
    // Create a new transport for each request to prevent request ID collisions

    const transport = new StreamableHTTPServerTransport({
        // stateless mode
        // for stateful mode:
        // (https://levelup.gitconnected.com/mcp-server-and-client-with-sse-the-new-streamable-http-d860850d9d9d)
        // 1. use sessionIdGenerator: () => randomUUID()
        // 2. save the generated ID: const sessionId = transport.sessionId and the corresponding transport
        // 3. try retrieve the session id with req.header["mcp-session-id"] for incoming request
        // 4. If session id is defined and there is an existing transport, use the transport instead of creating a new one.
        sessionIdGenerator: undefined,
        // to use Streamable HTTP instead of SSE
        enableJsonResponse: true
    })

    res.on('close', () => {
        transport.close()
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
})


app.listen(PORT, () => {
    console.log(`Pokemon MCP Server running on http://localhost:${PORT}/mcp`)
}).on('error', error => {
    console.error('Server error:', error)
    process.exit(1)
})