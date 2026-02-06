// GradientCard.tsx
import type {ColorScheme} from '../../types/journey.types'

interface GradientCardProps {
    color: ColorScheme
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

export function GradientCard({
                                 color,
                                 children,
                                 onClick,
                                 className = '',
                             }: GradientCardProps) {
    const baseClasses =
        `p-4 rounded-2xl shadow-lg transition-all duration-200 ${className}`

    const style = {
        background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
        boxShadow: `0 4px 20px ${color.primary}40`,
    }

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} hover:opacity-90 active:scale-[0.98] cursor-pointer w-full text-left`}
                style={style}
            >
                {children}
            </button>
        )
    }

    return (
        <div className={baseClasses} style={style}>
            {children}
        </div>
    )
}
