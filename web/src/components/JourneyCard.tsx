import {Link} from 'react-router-dom';
import {ChevronRight} from '@openai/apps-sdk-ui/components/Icon';
import type {ColorScheme} from '../types/journey.types';

interface JourneyCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: ColorScheme;
    to: string;
}

export function JourneyCard({title, description, icon, color, to}: JourneyCardProps) {
    return (
        <Link
            to={to}
            className="block p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            style={{
                background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
                boxShadow: `0 4px 20px ${color.primary}30`,
            }}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-white/80">{description}</p>
                </div>
                <div className="text-white/60">
                    <ChevronRight className="w-5 h-5"/>
                </div>
            </div>
        </Link>
    );
}
