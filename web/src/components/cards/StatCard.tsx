// StatCard.tsx
import type {ColorScheme} from '../../types/journey.types'
import {GRAY_600} from '../../constants/colors'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string
    color: ColorScheme
}

export function StatCard({icon, label, value, color}: StatCardProps) {
    return (
        <div
            className="flex-1 p-3 rounded-xl bg-white/95 border"
            style={{borderColor: `${color.primary}30`}}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{backgroundColor: color.light, color: color.primary}}
            >
                {icon}
            </div>

            <p className="text-xs font-medium" style={{color: GRAY_600}}>
                {label}
            </p>
            <p className="text-lg font-semibold" style={{color: color.primary}}>
                {value}
            </p>
        </div>
    )
}
