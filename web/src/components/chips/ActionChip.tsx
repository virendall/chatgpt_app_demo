// ActionChip.tsx
import {Button} from '@openai/apps-sdk-ui/components/Button'
import type {ColorScheme} from '../../types/journey.types'

interface ActionChipProps {
    label: string
    icon?: React.ReactNode
    color: ColorScheme
    onClick: () => void
    variant?: 'filled' | 'outline'
}

export function ActionChip({
                               label,
                               icon,
                               color,
                               onClick,
                               variant = 'filled',
                           }: ActionChipProps) {
    return (
        <Button
            variant={variant === 'filled' ? 'primary' : 'secondary'}
            size="sm"
            onClick={onClick}
            style={{
                backgroundColor: variant === 'filled' ? color.primary : 'transparent',
                borderColor: color.primary,
                color: variant === 'filled' ? '#fff' : color.primary,
            }}
        >
            {icon && <span className="mr-1">{icon}</span>}
            {label}
        </Button>
    )
}
