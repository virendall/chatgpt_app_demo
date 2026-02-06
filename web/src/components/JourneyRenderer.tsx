import {useState} from 'react'
import {Badge} from '@openai/apps-sdk-ui/components/Badge'
import {
    ArrowLeft,
    ArrowRotateCw,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    Info,
    MagnifyingGlassSearch,
    Star,
} from '@openai/apps-sdk-ui/components/Icon'
import type {JourneyData, JourneyStep, ListItem} from '../types/journey.types'
import {COLORS, GRAY_100, GRAY_600, WHITE, WHITE_20, WHITE_80, WHITE_90,} from '../constants/colors'
import {GlassCard, GradientCard, StatCard} from './cards'
import {ActionChip} from './chips'
import {ProgressRing} from './progress'

interface JourneyRendererProps {
    data: JourneyData
}

// Icon mapping from emoji/string to SDK icons
function getIconComponent(icon?: string): React.ReactNode {
    if (!icon) return null

    const iconMap: Record<string, React.ReactNode> = {
        '✔️': <CheckCircle className="w-5 h-5"/>,
        '⏰': <Clock className="w-5 h-5"/>,
        '⭐': <Star className="w-5 h-5"/>,
        '❤️': <Heart className="w-5 h-5"/>,
        '📅': <Calendar className="w-5 h-5"/>,
        '🔍': <MagnifyingGlassSearch className="w-5 h-5"/>,
        '⬅️': <ArrowLeft className="w-5 h-5"/>,
        'ℹ️': <Info className="w-5 h-5"/>,
        '🔄': <ArrowRotateCw className="w-5 h-5"/>,
    }

    return iconMap[icon] || <span>{icon}</span>
}

export function JourneyRenderer({data}: JourneyRendererProps) {
    const [step, setStep] = useState(0)
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    const currentStep = data.steps[step]
    const currentActions = data.actions[step] || []
    const color = COLORS[currentStep?.color || data.color]

    const handleAction = (nextStep?: number) => {
        if (nextStep !== undefined) {
            setStep(nextStep)
            setSelectedItem(null)
        }
    }

    const renderStepContent = (stepData: JourneyStep) => {
        const stepColor = COLORS[stepData.color || data.color]

        const renderStats = () => {
            if (!stepData.stats?.length) return null

            const hasProgress = stepData.stats.some(
                s => s.progress !== undefined
            )

            if (hasProgress) {
                return (
                    <div className="flex gap-4 mt-4">
                        {stepData.stats.map((stat, i) => (
                            <ProgressRing
                                key={i}
                                progress={stat.progress || 0}
                                color={WHITE}
                                label={stat.label}
                                detail={stat.value}
                            />
                        ))}
                    </div>
                )
            }

            return (
                <div className="flex gap-3 mt-4">
                    {stepData.stats.map((stat, i) => (
                        <StatCard
                            key={i}
                            icon={getIconComponent(stat.icon)}
                            label={stat.label}
                            value={stat.value}
                            color={stepColor}
                        />
                    ))}
                </div>
            )
        }

        const renderItems = () => {
            if (!stepData.items?.length) return null

            if (
                stepData.type === 'gradient-card' &&
                data.journeyId === 'find-doctor' &&
                step === 0
            ) {
                return (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {stepData.items.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleAction(1)}
                                className="flex items-center gap-2 px-3 py-2 rounded-full"
                                style={{backgroundColor: WHITE_20}}
                            >
                                <span>{item.icon}</span>
                                <span className="text-sm font-medium text-white">{item.label}</span>
                            </button>
                        ))}
                    </div>
                )
            }

            return (
                <div className="flex flex-col gap-3">
                    {stepData.items.map(item => (
                        <ListItemRow
                            key={item.id}
                            item={item}
                            isSelected={selectedItem === item.id}
                            onSelect={() => setSelectedItem(item.id)}
                            color={stepColor}
                            journeyId={data.journeyId}
                        />
                    ))}
                </div>
            );
        };

        const renderCheckpoints = () => {
            if (!stepData.checkpoints?.length) return null

            return (
                <div className="mt-2">
                    {stepData.checkpoints.map((point, i) => (
                        <div key={i} className="flex items-start gap-2 mt-2">
                            <span className="text-white">•</span>
                            <span className="text-sm" style={{color: WHITE}}>{point}</span>
                        </div>
                    ))}
                </div>
            );
        };

        const renderDetailRows = () => {
            if (!stepData.detailRows?.length) return null

            return (
                <div className="p-3 rounded-xl mt-3" style={{backgroundColor: WHITE_20}}>
                    {stepData.detailRows.map((row, i) => (
                        <div
                            key={i}
                            className={`flex justify-between ${i === stepData.detailRows!.length - 1 ? 'pt-2 border-t border-white/30' : 'mb-2'}`}
                        >
              <span className={`text-sm" ${i === stepData.detailRows!.length - 1 ? 'font-medium' : ''}`}
                    style={{color: i === stepData.detailRows!.length - 1 ? WHITE : WHITE_80}}>
                  {row.label}
              </span>
                            <span
                                className={`${i === stepData.detailRows!.length - 1 ? 'font-semibold' : 'font-medium text-sm'}`}
                                style={{color: WHITE}}
                            >
                    {row.value}
                </span>
                        </div>
                    ))
                    }
                </div>
            );
        };

        const renderSuccessContent = () => {
            return (
                <>
                    {stepData.successMessage && (
                        <p className="text-sm" style={{color: WHITE_90}}>
                            {stepData.successMessage}
                        </p>
                    )}
                    {stepData.infoBox && (
                        <div
                            className="mt-3 p-3 rounded-xl"
                            style={{backgroundColor: WHITE_20}}
                        >
              <span className="text-sm font-medium text-white">
                {stepData.infoBox}
              </span>
                        </div>
                    )}
                </>
            );
        };

        if (stepData.type === 'gradient-card') {
            return (
                <GradientCard color={stepColor}>
                    {stepData.icon && stepData.title && (
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-6 h-6 text-white"/>
                            <h3 className="text-lg font-semibold text-white">
                                {stepData.title}
                            </h3>
                        </div>
                    )}
                    {stepData.subtitle && (
                        <p className="text-sm mt-1" style={{color: WHITE_80}}>
                            {stepData.subtitle}
                        </p>
                    )}
                    {renderStats()}
                    {renderItems()}
                    {renderCheckpoints()}
                    {renderDetailRows()}
                    {renderSuccessContent()}
                </GradientCard>
            );
        }

        if (stepData.type === 'glass-card') {
            return (
                <GlassCard>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{stepData.title}</h3>
                        {stepData.badge && (
                            <Badge variant="success" size="sm">
                                {stepData.badge}
                            </Badge>
                        )}
                    </div>
                    {stepData.subtitle && (
                        <p className="text-sm mb-3" style={{color: GRAY_600}}>
                            {stepData.subtitle}
                        </p>
                    )}
                    {renderItems()}
                </GlassCard>
            );
        }

        return null
    }

    const shouldShowActions = () => {
        if (step === 1 && !selectedItem) return false
        return currentActions.length > 0
    }

    return (
        <div className="flex flex-col gap-3">
            {currentStep && renderStepContent(currentStep)}

            {shouldShowActions() && (
                <div className="flex flex-wrap gap-2">
                    {currentActions.map((action, i) => (
                        <ActionChip
                            key={i}
                            label={action.label}
                            icon={getIconComponent(action.icon)}
                            color={color}
                            variant={action.variant}
                            onClick={() => handleAction(action.nextStep)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface ListItemRowProps {
    item: ListItem
    isSelected: boolean
    onSelect: () => void
    color: { primary: string; secondary: string; light: string }
    journeyId: string
}

function ListItemRow({
                         item,
                         isSelected,
                         onSelect,
                         color,
                         journeyId,
                     }: ListItemRowProps) {
    const getStatusColor = (status?: string) => {
        if (status === 'Paid') return COLORS.green.primary
        if (status === 'Processing') return COLORS.orange.primary
        return COLORS.blue.primary
    }

    if (journeyId === 'plan-benefits') {
        return (
            <button
                onClick={onSelect}
                className="flex items-center p-3 rounded-xl transition-all text-left w-full"
                style={{
                    backgroundColor: isSelected ? color.light : GRAY_100,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: color.primary,
                    borderStyle: 'solid',
                }}
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{backgroundColor: color.light}}
                >
                    <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1 ml-3">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs" style={{color: GRAY_600}}>
                        {item.sublabel}
                    </p>
                </div>
                <span
                    className="font-semibold"
                    style={{color: color.primary}}
                >
          {item.cost}
        </span>
            </button>
        )
    }

    if (journeyId === 'find-doctor') {
        return (
            <button
                onClick={onSelect}
                className="flex items-center p-3 rounded-xl transition-all text-left w-full"
                style={{
                    backgroundColor: isSelected ? color.light : GRAY_100,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: color.primary,
                    borderStyle: 'solid',
                }}
            >
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                    style={{backgroundColor: color.primary}}
                >
                    {item.label.split(' ')[0][0] || 'D'}
                </div>
                <div className="flex-1 ml-3">
                    <p className="text-sm font-medium">{item.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-500"/>
                        <span className="text-sm">
              {item.rating} ({item.reviews})
            </span>
                        <span
                            className="text-sm ml-2"
                            style={{color: GRAY_600}}
                        >
              {item.distance}
            </span>
                    </div>
                </div>
                <Badge variant="success" size="sm">
                    {item.available}
                </Badge>
            </button>
        )
    }

    if (journeyId === 'claims') {
        return (
            <button
                onClick={onSelect}
                className="flex items-center justify-between p-3 rounded-xl transition-all text-left w-full"
                style={{
                    backgroundColor: isSelected ? color.light : GRAY_100,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: color.primary,
                    borderStyle: 'solid',
                }}
            >
                <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs" style={{color: GRAY_600}}>
                        {item.sublabel}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{item.amount}</p>
                    <Badge
                        variant={item.status === 'Paid' ? 'success' : 'warning'}
                        size="sm"
                    >
                        {item.status}
                    </Badge>
                </div>
            </button>
        );
    }
    // Prescriptions style (FIXED)
    if (journeyId === 'prescriptions') {
        return (
            <button
                onClick={onSelect}
                className="flex items-center p-3 rounded-xl transition-all text-left w-full"
                style={{
                    backgroundColor: isSelected ? color.light : GRAY_100,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: color.primary,
                    borderStyle: 'solid',
                }}
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{backgroundColor: color.primary}}
                >
          <span className="text-lg text-white">
            {item.icon ?? '💊'}
          </span>
                </div>

                <div className="flex-1 ml-3">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">
                        {item.refills} refills left
                    </p>
                </div>

                <div className="text-right">
                    <p className="font-semibold" style={{color: color.primary}}>
                        {item.cost}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        Refill {item.nextRefill}
                    </p>
                </div>
            </button>
        );
    }

    // Default style
    return (
        <button
            onClick={onSelect}
            className="flex items-center p-3 rounded-xl transition-all text-left w-full"
            style={{
                backgroundColor: isSelected ? color.light : GRAY_100,
                borderWidth: isSelected ? 2 : 0,
                borderColor: color.primary,
                borderStyle: 'solid',
            }}
        >
            {item.icon && (
                <span className="text-lg mr-3">{item.icon}</span>
            )}
            <span className="font-medium">{item.label}</span>
        </button>
    );
}
