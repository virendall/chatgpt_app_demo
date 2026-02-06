// prescriptions.ts
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {z} from 'zod'
import {JourneyDataSchema, type JourneyData} from '../schemas/index.js'
import {readFileSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {toolLogger} from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const VERSION = '1.0.0'
export const PRESCRIPTIONS_RESOURCE_URL =
    `ui://widget/prescriptions.html?version=${VERSION}`

function getMockData(): JourneyData {
    const dataPath = join(__dirname, '..', '..', 'src', 'data', 'prescriptions.mock.json')
    toolLogger.debug('Loading mock data from:', dataPath)

    try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
        return JourneyDataSchema.parse(data)
    } catch (error) {
        toolLogger.error('Failed to load mock data:', error)
        throw new Error(`Failed to load prescriptions mock data from ${dataPath}: ${error}`)
    }
}

export function registerPrescriptionsTool(server: McpServer) {
    toolLogger.info('Registering tool: get_prescriptions')

    server.registerTool(
        'get_prescriptions',
        {
            title: 'Get Prescriptions',
            description:
                'Get user prescriptions, refill status, and medication costs. Returns active prescriptions, refill information, and pharmacy details.',
            _meta: {
                'openai/outputTemplate': PRESCRIPTIONS_RESOURCE_URL,
                'openai/toolInvocation/invoking': 'Loading prescriptions...',
                'openai/toolInvocation/invoked': 'Prescriptions loaded!',
                'openai/widgetAccessible': true,
            },
            inputSchema: {
                userId: z.string({description: 'User ID to fetch prescriptions for'}).optional(),
            },
            outputSchema: {
                journey: JourneyDataSchema,
            },
        },
        async ({userId}) => {
            toolLogger.tool('call', 'get_prescriptions', {userId})

            // TODO: Replace with real pharmacy/prescription API call
            const data = getMockData()

            toolLogger.tool('result', 'get_prescriptions', {
                journeyId: data.journeyId,
                stepsCount: data.steps.length,
            })

            const result = {
                content: [{type: 'text' as const, text: JSON.stringify({journey: data})}],
                structuredContent: {journey: data},
            }

            toolLogger.info('Returning result:', result)
            return result
        }
    )
}
