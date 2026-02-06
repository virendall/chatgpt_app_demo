// doctors.ts
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {DOCTORS_RESOURCE_URL} from '../tools/doctors.js'
import {resourceLogger} from '../utils/logger.js'

const RESOURCE_MIME_TYPE = 'text/html+skybridge'

export function registerDoctorsResource(server: McpServer, html: string) {
    resourceLogger.resource('register', 'find-doctor-widget', DOCTORS_RESOURCE_URL)

    server.registerResource(
        'find-doctor-widget',
        DOCTORS_RESOURCE_URL,
        {
            title: 'Find Doctor Widget',
            description: 'Interactive widget for searching and booking healthcare providers',
        },
        async () => {
            resourceLogger.resource('fetch', 'find-doctor-widget', DOCTORS_RESOURCE_URL)
            return {
                contents: [
                    {
                        uri: DOCTORS_RESOURCE_URL,
                        mimeType: RESOURCE_MIME_TYPE,
                        text: html,
                    },
                ],
            }
        }
    )
}
