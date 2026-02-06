import {
    ShieldCheck,
    Stethoscope,
    Invoice,
    Health,
} from '@openai/apps-sdk-ui/components/Icon';
import { JourneyCard } from '../components/JourneyCard';
import { journeyList } from '../data';
import { COLORS } from '../constants/colors';

const journeyIcons: Record<string, React.ReactNode> = {
    'plan-benefits': <ShieldCheck className="w-6 h-6 text-white" />,
    'find-doctor': <Stethoscope className="w-6 h-6 text-white" />,
    claims: <Invoice className="w-6 h-6 text-white" />,
    prescriptions: <Health className="w-6 h-6 text-white" />,
};

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Adaptive Assistant
                    </h1>
                    <p className="text-slate-600">
                        Select a journey to explore your health benefits
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {journeyList.map((journey) => (
                        <JourneyCard
                            key={journey.journeyId}
                            title={journey.title}
                            description={journey.description}
                            icon={journeyIcons[journey.journeyId] || journey.icon}
                            color={COLORS[journey.color]}
                            to={`/${journey.journeyId}`}
                        />
                    ))}
                </div>

                <div className="text-center mt-8 text-sm text-slate-500">
                    <p>Powered by OpenAI</p>
                </div>
            </div>
        </div>
    );
}
