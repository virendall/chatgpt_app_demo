// doctor-search.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { toolLogger } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const VERSION = '1.0.2'
export const DOCTOR_SEARCH_RESOURCE_URL = `ui://widget/doctor-search.html?version=${VERSION}`

// Zod schemas for doctor search output
const BrighterScoreSchema = z.object({
    score: z.string().optional(),
    description: z.string().optional(),
})

const DoctorLocationSchema = z.object({
    facilityName: z.string().optional(),
    streetName: z.string().optional(),
    city: z.string().optional(),
    stateCode: z.string().optional(),
    zipCode: z.string().optional(),
    locationDistance: z.string().optional(),
    phones: z.array(z.string()).optional(),
    acceptingNewPatientIndicator: z.string().optional(),
    networkName: z.string().optional(),
    networkTierCode: z.string().optional(),
    formattedAddressResults: z.string().optional(),
    specialties: z.array(z.object({
        code: z.string(),
        description: z.string(),
    })).optional(),
    brighterMatch: z.object({
        brighterOverallScore: BrighterScoreSchema.optional(),
        brighterAffordabilityScore: BrighterScoreSchema.optional(),
        brighterProfessionalHistoryScore: BrighterScoreSchema.optional(),
        brighterPatientExperienceScore: BrighterScoreSchema.optional(),
    }).optional(),
})

const DoctorProviderSchema = z.object({
    name: z.string({ description: 'Full name with degree' }),
    providerId: z.string({ description: 'Provider ID' }),
    brighterProfileImageThumbNailURL: z.string().optional(),
    degrees: z.array(z.string()).optional(),
    specialties: z.array(z.object({
        code: z.string(),
        description: z.string(),
    })).optional(),
    yearsOfExperience: z.string().optional(),
    location: DoctorLocationSchema,
})

const DoctorSearchResultSchema = z.object({
    doctors: z.array(DoctorProviderSchema, { description: 'List of doctor providers' }),
    totalCount: z.string({ description: 'Total search result count' }),
    searchRadius: z.number({ description: 'Search radius in miles' }),
})

interface RawProvider {
    name: string
    providerId: string
    brighterProfileImageThumbNailURL?: string
    degrees?: string[]
    specialties?: Array<{ code: string; description: string; boardCertificationFlag?: string }>
    yearsOfExperience?: string
    locations?: Array<{
        facilityName?: string
        streetName?: string
        city?: string
        stateCode?: string
        zipCode?: string
        locationDistance?: string
        phones?: string[]
        acceptingNewPatientIndicator?: string
        networkName?: string
        networkTierCode?: string
        formattedAddressResults?: string
        specialties?: Array<{ code: string; description: string }>
        brighterMatch?: {
            brighterOverallScore?: { score?: string }
            brighterAffordabilityScore?: { score?: string; description?: string }
            brighterProfessionalHistoryScore?: { score?: string; description?: string }
            brighterPatientExperienceScore?: { score?: string; description?: string }
        }
    }>
}

function getMockData() {
    const dataPath = join(__dirname, '..', '..', 'src', 'data', 'doctor-search.mock.json')
    toolLogger.debug('Loading mock data from:', dataPath)

    try {
        const rawData = JSON.parse(readFileSync(dataPath, 'utf-8'))
        const providers: RawProvider[] = rawData.searchResult?.providerGroups?.[0]?.providers || []
        const totalCount = rawData.searchResult?.providerGroups?.[0]?.totalSearchCount || '0'
        const searchRadius = rawData.searchResult?.providerGroups?.[0]?.searchRadius || 0

        // Transform providers: flatten location data to first location only
        const doctors = providers.slice(0, 10).map((provider) => {
            const loc = provider.locations?.[0]
            return {
                name: provider.name,
                providerId: provider.providerId,
                brighterProfileImageThumbNailURL: provider.brighterProfileImageThumbNailURL,
                degrees: provider.degrees,
                specialties: provider.specialties?.map(s => ({ code: s.code, description: s.description })),
                yearsOfExperience: provider.yearsOfExperience,
                location: {
                    facilityName: loc?.facilityName,
                    streetName: loc?.streetName,
                    city: loc?.city,
                    stateCode: loc?.stateCode,
                    zipCode: loc?.zipCode,
                    locationDistance: loc?.locationDistance,
                    phones: loc?.phones,
                    acceptingNewPatientIndicator: loc?.acceptingNewPatientIndicator,
                    networkName: loc?.networkName,
                    networkTierCode: loc?.networkTierCode,
                    formattedAddressResults: loc?.formattedAddressResults,
                    specialties: loc?.specialties,
                    brighterMatch: loc?.brighterMatch ? {
                        brighterOverallScore: loc.brighterMatch.brighterOverallScore,
                        brighterAffordabilityScore: loc.brighterMatch.brighterAffordabilityScore,
                        brighterProfessionalHistoryScore: loc.brighterMatch.brighterProfessionalHistoryScore,
                        brighterPatientExperienceScore: loc.brighterMatch.brighterPatientExperienceScore,
                    } : undefined,
                },
            }
        })

        return DoctorSearchResultSchema.parse({ doctors, totalCount, searchRadius })
    } catch (error) {
        toolLogger.error('Failed to load mock data:', error)
        throw new Error(`Failed to load doctor search mock data: ${error}`)
    }
}

export function registerDoctorSearchTool(server: McpServer) {
    toolLogger.info('Registering tool: search_doctors')

    server.registerTool(
        'search_doctors',
        {
            title: 'Search Doctors',
            description:
                'Search for healthcare providers with detailed information. Returns doctor listings with ratings, specialties, locations, and availability.',
            _meta: {
                'openai/outputTemplate': DOCTOR_SEARCH_RESOURCE_URL,
                'openai/toolInvocation/invoking': 'Searching for doctors...',
                'openai/toolInvocation/invoked': 'Doctors found!',
                'openai/widgetAccessible': true,
            },
            inputSchema: {
                specialty: z
                    .string({
                        description: 'Medical specialty to search for (e.g., Orthodontics, Primary Care)',
                    })
                    .optional(),
                location: z
                    .string({
                        description: 'Location or zip code for provider search',
                    })
                    .optional(),
            },
            outputSchema: {
                doctorSearch: DoctorSearchResultSchema,
            },
        },
        async ({ specialty, location }) => {
            toolLogger.tool('call', 'search_doctors', { specialty, location })

            const data = getMockData()

            toolLogger.tool('result', 'search_doctors', {
                doctorsCount: data.doctors.length,
                totalCount: data.totalCount,
            })

            return {
                content: [{ type: 'text', text: JSON.stringify({ doctorSearch: data }) }],
                structuredContent: { doctorSearch: data },
            }
        }
    )
}
