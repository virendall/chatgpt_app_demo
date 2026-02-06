// GlassCard.tsx
interface GlassCardProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

export function GlassCard({
                              children,
                              onClick,
                              className = '',
                          }: GlassCardProps) {
    const baseClasses =
        `p-4 rounded-2xl bg-white/95 border border-black/10 shadow-md transition-all duration-200 ${className}`

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} hover:opacity-90 cursor-pointer w-full text-left`}
            >
                {children}
            </button>
        )
    }

    return <div className={baseClasses}>{children}</div>
}
