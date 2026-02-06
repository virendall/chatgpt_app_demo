export type ColorTheme = 'blue' | 'green' | 'orange' | 'purple' | 'sunset';

export interface ColorScheme {
    primary: string;
    secondary: string;
    light: string;
}

// Stat item for progress rings and stat cards
export interface StatItem {
    label: string;
    value: string;
    progress?: number;
    icon?: string;
}

// List item (benefits, doctors, claims, prescriptions)
export interface ListItem {
    id: string;
    icon?: string;
    label: string;
    sublabel?: string;
    value?: string;
    status?: string;
    rating?: number;
    reviews?: number;
    distance?: string;
    available?: string;
    refills?: number;
    nextRefill?: string;
    cost?: string;
    date?: string;
    amount?: string;
    yourCost?: string;
    provider?: string;
}

// Action button/chip
export interface ActionItem {
    label: string;
    icon?: string;
    nextStep?: number;
    variant?: 'filled' | 'outline';
}

// Step in a journey
export interface JourneyStep {
    type: 'gradient-card' | 'glass-card';
    color?: ColorTheme;
    title?: string;
    subtitle?: string;
    stats?: StatItem[];
    items?: ListItem[];
    checkpoints?: string[];
    detailRows?: { label: string; value: string }[];
    badge?: string;
    successMessage?: string;
    infoBox?: string;
}

// Complete journey data
export interface JourneyData {
    journeyId: string;
    title: string;
    description: string;
    color: ColorTheme;
    icon: string;
    steps: JourneyStep[];
    actions: ActionItem[][];
}

// Journey IDs
export const JOURNEY_IDS = {
    PLAN_BENEFITS: 'plan-benefits',
    FIND_DOCTOR: 'find-doctor',
    CLAIMS: 'claims',
    PRESCRIPTIONS: 'prescriptions',
} as const;

export type JourneyId = (typeof JOURNEY_IDS)[keyof typeof JOURNEY_IDS];
