// prescriptions.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { PRESCRIPTIONS_RESOURCE_URL } from '../tools/prescriptions.js'
import { resourceLogger } from '../utils/logger.js'

const RESOURCE_MIME_TYPE = 'text/html+skybridge'

export function registerPrescriptionsResource(server: McpServer, html: string) {
    resourceLogger.resource('register', 'prescriptions-widget', PRESCRIPTIONS_RESOURCE_URL)

    server.registerResource(
        'prescriptions-widget',
        PRESCRIPTIONS_RESOURCE_URL,
        {
            title: 'Prescriptions Widget',
            description: 'Interactive widget for managing prescriptions and refills',
        },
        async () => {
            resourceLogger.resource('fetch', 'prescriptions-widget', PRESCRIPTIONS_RESOURCE_URL)
            return {
                contents: [
                    {
                        uri: PRESCRIPTIONS_RESOURCE_URL,
                        mimeType: RESOURCE_MIME_TYPE,
                        text: html,
                    },
                ],
            }
        }
    )
}
