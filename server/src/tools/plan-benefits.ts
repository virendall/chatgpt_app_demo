// plan-benefits.ts
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
export const PLAN_BENEFITS_RESOURCE_URL =
    `ui://widget/plan-benefits.html?version=${VERSION}`

function getMockData(): JourneyData {
    const dataPath = join(__dirname, '..', '..', 'src', 'data', 'plan-benefits.mock.json')
    toolLogger.debug('Loading mock data from:', dataPath)

    try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
        return JourneyDataSchema.parse(data)
    } catch (error) {
        toolLogger.error('Failed to load mock data:', error)
        throw new Error(`Failed to load plan benefits mock data from ${dataPath}: ${error}`)
    }
}

export function registerPlanBenefitsTool(server: McpServer) {
    toolLogger.info('Registering tool: get_plan_benefits')

    server.registerTool(
        'get_plan_benefits',
        {
            title: 'Get Plan Benefits',
            description:
                'Get health insurance plan benefits and coverage details. Returns deductible progress, coverage highlights, and costs.',
            _meta: {
                'openai/outputTemplate': PLAN_BENEFITS_RESOURCE_URL,
                'openai/toolInvocation/invoking': 'Loading plan benefits...',
                'openai/toolInvocation/invoked': 'Benefits loaded!',
                'openai/widgetAccessible': true,
            },
            inputSchema: {
                userId: z.string({ description: 'User ID to fetch plan benefits for' }).optional(),
                planId: z.string({ description: 'Specific plan ID to get benefits for' }).optional(),
            },
            outputSchema: {
                journey: JourneyDataSchema,
            },
        },
        async ({ userId, planId }) => {
            toolLogger.tool('call', 'get_plan_benefits', { userId, planId })

            // TODO: Replace with real benefits API call
            const data = getMockData()

            toolLogger.tool('result', 'get_plan_benefits', {
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
