// claims.ts
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {CLAIMS_RESOURCE_URL} from '../tools/claims.js'
import {resourceLogger} from '../utils/logger.js'

const RESOURCE_MIME_TYPE = 'text/html+skybridge'

export function registerClaimsResource(server: McpServer, html: string) {
    resourceLogger.resource('register', 'claims-widget', CLAIMS_RESOURCE_URL)

    server.registerResource(
        'claims-widget',
        CLAIMS_RESOURCE_URL,
        {
            title: 'Claims Widget',
            description: 'Interactive widget for viewing and managing insurance claims',
        },
        async () => {
            resourceLogger.resource('fetch', 'claims-widget', CLAIMS_RESOURCE_URL)
            return {
                contents: [
                    {
                        uri: CLAIMS_RESOURCE_URL,
                        mimeType: RESOURCE_MIME_TYPE,
                        text: html,
                    },
                ],
            }
        }
    )
}
