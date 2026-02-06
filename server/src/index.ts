// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express, { Request, Response, NextFunction } from 'express'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { registerAllTools } from './tools/index.js'
import { registerAllResources, type HtmlResources } from './resources/index.js'
import { serverLogger, httpLogger } from './utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 3000

// Load HTML files for each page
const HTML_BASE_PATH = join(__dirname, '..', '..', 'web/dist')

function loadHtmlResources(): HtmlResources {
    serverLogger.info('Loading HTML resources from:', HTML_BASE_PATH)

    const resources = {
        claims: readFileSync(join(HTML_BASE_PATH, 'claims.html'), 'utf8'),
        findDoctor: readFileSync(join(HTML_BASE_PATH, 'find-doctor.html'), 'utf8'),
        planBenefits: readFileSync(join(HTML_BASE_PATH, 'plan-benefits.html'), 'utf8'),
        prescriptions: readFileSync(join(HTML_BASE_PATH, 'prescriptions.html'), 'utf8'),
    }

    serverLogger.info('Loaded HTML resources:', Object.keys(resources))
    return resources
}

/***************************
 ******** MCP Server ********
 ***************************/
serverLogger.info('Initializing MCP Server...')

const server = new McpServer(
    {
        name: 'healthcare-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
)

// Register all tools (claims, doctors, plan-benefits, prescriptions)
serverLogger.info('Registering tools...')
registerAllTools(server)

// Register all resources (HTML widgets for each page)
serverLogger.info('Registering resources...')
const htmlResources = loadHtmlResources()
registerAllResources(server, htmlResources)

/***************************
 ****** Express Server *****
 ***************************/
const app = express()
app.use(express.json())

// CORS middleware for local development
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')

    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
        return
    }
    next()
})

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    httpLogger.request(
        req.method,
        req.path,
        req.body?.method
            ? {
                jsonrpc: req.body.jsonrpc,
                method: req.body.method,
                id: req.body.id,
                params: req.body.params,
            }
            : undefined
    )

    res.on('finish', () => {
        const duration = Date.now() - startTime
        httpLogger.response(res.statusCode, duration)
    })

    next()
})

app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    })

    res.on('close', () => {
        httpLogger.debug('Connection closed')
        transport.close()
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', server: 'healthcare-server', version: '1.0.0' })
})

app.listen(PORT, () => {
    serverLogger.info('='.repeat(50))
    serverLogger.info('Healthcare MCP Server started')
    serverLogger.info(`Listening on: http://localhost:${PORT}/mcp`)
    serverLogger.info(`Health check: http://localhost:${PORT}/health`)
    serverLogger.info('='.repeat(50))
}).on('error', (error) => {
    serverLogger.error('Server error:', error)
    process.exit(1)
})
