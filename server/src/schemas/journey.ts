// journey.ts
import { z } from 'zod'

// Color theme enum
export const ColorThemeSchema = z.enum(['blue', 'green', 'orange', 'purple', 'sunset'])
export type ColorTheme = z.infer<typeof ColorThemeSchema>

// Color scheme for theming
export const ColorSchemeSchema = z.object({
    primary: z.string(),
    secondary: z.string(),
    light: z.string(),
})
export type ColorScheme = z.infer<typeof ColorSchemeSchema>

// Stat item for progress rings and stat cards
export const StatItemSchema = z.object({
    label: z.string({ description: 'Label for the stat' }),
    value: z.string({ description: 'Display value for the stat' }),
    progress: z.number({ description: 'Progress value between 0 and 1' }).min(0).max(1).optional(),
    icon: z.string({ description: 'Icon emoji or identifier' }).optional(),
})
export type StatItem = z.infer<typeof StatItemSchema>

// List item (benefits, doctors, claims, prescriptions)
export const ListItemSchema = z.object({
    id: z.string({ description: 'Unique identifier for the item' }),
    icon: z.string({ description: 'Icon emoji or identifier' }).optional(),
    label: z.string({ description: 'Primary label/name' }),
    sublabel: z.string({ description: 'Secondary descriptive text' }).optional(),
    value: z.string({ description: 'Value to display' }).optional(),
    status: z.string({ description: 'Status indicator (e.g., Paid, Processing)' }).optional(),
    rating: z.number({ description: 'Rating score' }).optional(),
    reviews: z.number({ description: 'Number of reviews' }).int().optional(),
    distance: z.string({ description: 'Distance from user' }).optional(),
    available: z.string({ description: 'Availability info' }).optional(),
    refills: z.number({ description: 'Number of refills remaining' }).int().optional(),
    nextRefill: z.string({ description: 'Next refill date' }).optional(),
    cost: z.string({ description: 'Cost display string' }).optional(),
    date: z.string({ description: 'Date string' }).optional(),
    amount: z.string({ description: 'Amount display string' }).optional(),
    yourCost: z.string({ description: 'Patient cost display string' }).optional(),
    provider: z.string({ description: 'Provider name' }).optional(),
})
export type ListItem = z.infer<typeof ListItemSchema>

// Action button/chip
export const ActionItemSchema = z.object({
    label: z.string({ description: 'Button/action label' }),
    icon: z.string({ description: 'Icon emoji or identifier' }).optional(),
    nextStep: z.number({ description: 'Index of next step to navigate to' }).int().optional(),
    variant: z.enum(['filled', 'outline']).optional(),
})
export type ActionItem = z.infer<typeof ActionItemSchema>

// Detail row for key-value pairs
export const DetailRowSchema = z.object({
    label: z.string({ description: 'Row label' }),
    value: z.string({ description: 'Row value' }),
})
export type DetailRow = z.infer<typeof DetailRowSchema>

// Step in a journey
export const JourneyStepSchema = z.object({
    type: z.enum(['gradient-card', 'glass-card'], {
        description: 'Card type for rendering',
    }),
    color: ColorThemeSchema.optional(),
    title: z.string({ description: 'Step title' }).optional(),
    subtitle: z.string({ description: 'Step subtitle' }).optional(),
    stats: z.array(StatItemSchema).optional(),
    items: z.array(ListItemSchema).optional(),
    checkpoints: z.array(z.string()).optional(),
    detailRows: z.array(DetailRowSchema).optional(),
    badge: z.string({ description: 'Badge text to display' }).optional(),
    successMessage: z.string({ description: 'Success message to display' }).optional(),
    infoBox: z.string({ description: 'Info box content' }).optional(),
    icon: z.string({ description: 'Icon emoji or identifier' }).optional(),
})
export type JourneyStep = z.infer<typeof JourneyStepSchema>

// Complete journey data
export const JourneyDataSchema = z.object({
    journeyId: z.string({ description: 'Unique journey identifier' }),
    title: z.string({ description: 'Journey title' }),
    description: z.string({ description: 'Journey description' }),
    color: ColorThemeSchema,
    icon: z.string({ description: 'Journey icon emoji' }),
    steps: z.array(JourneyStepSchema, {
        description: 'Array of journey steps',
    }),
    actions: z.array(z.array(ActionItemSchema), {
        description: 'Actions per step',
    }),
})
export type JourneyData = z.infer<typeof JourneyDataSchema>

// Journey IDs
export const JOURNEY_IDS = {
    PLAN_BENEFITS: 'plan-benefits',
    FIND_DOCTOR: 'find-doctor',
    CLAIMS: 'claims',
    PRESCRIPTIONS: 'prescriptions',
} as const

export type JourneyId = (typeof JOURNEY_IDS)[keyof typeof JOURNEY_IDS]
