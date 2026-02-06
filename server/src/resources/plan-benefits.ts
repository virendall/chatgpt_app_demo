// plan-benefits.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { PLAN_BENEFITS_RESOURCE_URL } from '../tools/plan-benefits.js'
import { resourceLogger } from '../utils/logger.js'

const RESOURCE_MIME_TYPE = 'text/html+skybridge'

export function registerPlanBenefitsResource(server: McpServer, html: string) {
    resourceLogger.resource('register', 'plan-benefits-widget', PLAN_BENEFITS_RESOURCE_URL)

    server.registerResource(
        'plan-benefits-widget',
        PLAN_BENEFITS_RESOURCE_URL,
        {
            title: 'Plan Benefits Widget',
            description: 'Interactive widget for viewing health insurance plan benefits and coverage',
        },
        async () => {
            resourceLogger.resource('fetch', 'plan-benefits-widget', PLAN_BENEFITS_RESOURCE_URL)
            return {
                contents: [
                    {
                        uri: PLAN_BENEFITS_RESOURCE_URL,
                        mimeType: RESOURCE_MIME_TYPE,
                        text: html,
                    },
                ],
            }
        }
    )
}
