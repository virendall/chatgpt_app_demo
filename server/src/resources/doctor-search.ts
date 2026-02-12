// doctor-search.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { DOCTOR_SEARCH_RESOURCE_URL } from '../tools/doctor-search.js'
import { resourceLogger } from '../utils/logger.js'

const RESOURCE_MIME_TYPE = 'text/html+skybridge'

export function registerDoctorSearchResource(server: McpServer, html: string) {
    resourceLogger.resource('register', 'doctor-search-widget', DOCTOR_SEARCH_RESOURCE_URL)

    server.registerResource(
        'doctor-search-widget',
        DOCTOR_SEARCH_RESOURCE_URL,
        {
            title: 'Doctor Search Widget',
            description: 'Interactive widget for searching healthcare providers with detailed information',
        },
        async () => {
            resourceLogger.resource('fetch', 'doctor-search-widget', DOCTOR_SEARCH_RESOURCE_URL)
            return {
                contents: [
                    {
                        uri: DOCTOR_SEARCH_RESOURCE_URL,
                        mimeType: RESOURCE_MIME_TYPE,
                        text: html,
                    },
                ],
            }
        }
    )
}
