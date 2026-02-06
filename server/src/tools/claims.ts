// claims.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { JourneyDataSchema, type JourneyData } from '../schemas/index.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { toolLogger } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const VERSION = '1.0.0'
export const CLAIMS_RESOURCE_URL = `ui://widget/claims.html?version=${VERSION}`

function getMockData(): JourneyData {
    const dataPath = join(__dirname, '..', '..', 'src', 'data', 'claims.mock.json')
    toolLogger.debug('Loading mock data from:', dataPath)

    try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
        return JourneyDataSchema.parse(data)
    } catch (error) {
        toolLogger.error('Failed to load mock data:', error)
        throw new Error(`Failed to load claims mock data from ${dataPath}: ${error}`)
    }
}

export function registerClaimsTool(server: McpServer) {
    toolLogger.info('Registering tool: get_claims')

    server.registerTool(
        'get_claims',
        {
            title: 'Get Claims',
            description:
                'Get user claims status and history. Returns claim details, payment status, and costs.',
            _meta: {
                'openai/outputTemplate': CLAIMS_RESOURCE_URL,
                'openai/toolInvocation/invoking': 'Loading claims...',
                'openai/toolInvocation/invoked': 'Claims loaded!',
                'openai/widgetAccessible': true,
            },
            inputSchema: {
                userId: z.string({ description: 'User ID to fetch claims for' }).optional(),
            },
            outputSchema: {
                journey: JourneyDataSchema,
            },
        },
        async ({ userId }) => {
            toolLogger.tool('call', 'get_claims', { userId })

            // TODO: Replace with real API call using userId
            const data = getMockData()

            toolLogger.tool('result', 'get_claims', {
                journeyId: data.journeyId,
                stepsCount: data.steps.length,
            })

            return {
                content: [{ type: 'text', text: JSON.stringify({ journey: data }) }],
                structuredContent: { journey: data },
            }
        }
    )
}
