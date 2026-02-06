import {GRAY_600} from '../../constants/colors'

interface ProgressRingProps {
    progress: number
    size?: number
    color: string
    label: string
    detail: string
}

export function ProgressRing({
                                 progress,
                                 size = 70,
                                 color,
                                 label,
                                 detail,
                             }: ProgressRingProps) {
    const strokeWidth = 6
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - progress * circumference

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{width: size, height: size}}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={`${color}30`}
                        strokeWidth={strokeWidth}
                    />

                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
          <span
              className="text-sm font-semibold"
              style={{color}}
          >
            {Math.round(progress * 100)}%
          </span>
                </div>
            </div>

            <p
                className="text-xs font-medium mt-2"
                style={{color}}
            >
                {label}
            </p>
            <p
                className="text-xs"
                style={{color: GRAY_600}}
            >
                {detail}
            </p>
        </div>
    )
}
