// doctors.ts
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
export const DOCTORS_RESOURCE_URL = `ui://widget/find-doctor.html?version=${VERSION}`

function getMockData(): JourneyData {
    const dataPath = join(__dirname, '..', '..', 'src', 'data', 'find-doctor.mock.json')
    toolLogger.debug('Loading mock data from:', dataPath)

    try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
        return JourneyDataSchema.parse(data)
    } catch (error) {
        toolLogger.error('Failed to load mock data:', error)
        throw new Error(`Failed to load doctors mock data from ${dataPath}: ${error}`)
    }
}

export function registerDoctorsTool(server: McpServer) {
    toolLogger.info('Registering tool: get_doctors')

    server.registerTool(
        'get_doctors',
        {
            title: 'Find Doctors',
            description:
                'Search for in-network healthcare providers. Returns doctor listings with ratings, availability, and specialty information.',
            _meta: {
                'openai/outputTemplate': DOCTORS_RESOURCE_URL,
                'openai/toolInvocation/invoking': 'Searching for doctors...',
                'openai/toolInvocation/invoked': 'Doctors found!',
                'openai/widgetAccessible': true,
            },
            inputSchema: {
                specialty: z
                    .string({
                        description: 'Medical specialty to search for (e.g., Primary Care, Cardiology)',
                    })
                    .optional(),
                location: z
                    .string({
                        description: 'Location or zip code for provider search',
                    })
                    .optional(),
            },
            outputSchema: {
                journey: JourneyDataSchema,
            },
        },
        async ({ specialty, location }) => {
            toolLogger.tool('call', 'get_doctors', { specialty, location })

            // TODO: Replace with real provider directory API call
            const data = getMockData()

            toolLogger.tool('result', 'get_doctors', {
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
