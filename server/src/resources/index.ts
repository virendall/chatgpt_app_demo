// index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerClaimsResource } from './claims.js'
import { registerDoctorsResource } from './doctors.js'
import { registerDoctorSearchResource } from './doctor-search.js'
import { registerPlanBenefitsResource } from './plan-benefits.js'
import { registerPrescriptionsResource } from './prescriptions.js'

export interface HtmlResources {
    claims: string
    // findDoctor: string
    doctorSearch: string
    planBenefits: string
    prescriptions: string
}

export function registerAllResources(server: McpServer, html: HtmlResources) {
    registerClaimsResource(server, html.claims)
    // registerDoctorsResource(server, html.findDoctor)
    registerDoctorSearchResource(server, html.doctorSearch)
    registerPlanBenefitsResource(server, html.planBenefits)
    registerPrescriptionsResource(server, html.prescriptions)
}

export { registerClaimsResource } from './claims.js'
export { registerDoctorsResource } from './doctors.js'
export { registerDoctorSearchResource } from './doctor-search.js'
export { registerPlanBenefitsResource } from './plan-benefits.js'
export { registerPrescriptionsResource } from './prescriptions.js'
