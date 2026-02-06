// index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerClaimsTool } from './claims.js'
import { registerDoctorsTool } from './doctors.js'
import { registerPlanBenefitsTool } from './plan-benefits.js'
import { registerPrescriptionsTool } from './prescriptions.js'

export function registerAllTools(server: McpServer) {
    registerClaimsTool(server)
    registerDoctorsTool(server)
    registerPlanBenefitsTool(server)
    registerPrescriptionsTool(server)
}

export { registerClaimsTool } from './claims.js'
export { registerDoctorsTool } from './doctors.js'
export { registerPlanBenefitsTool } from './plan-benefits.js'
export { registerPrescriptionsTool } from './prescriptions.js'

export { CLAIMS_RESOURCE_URL } from './claims.js'
export { DOCTORS_RESOURCE_URL } from './doctors.js'
export { PLAN_BENEFITS_RESOURCE_URL } from './plan-benefits.js'
export { PRESCRIPTIONS_RESOURCE_URL } from './prescriptions.js'
