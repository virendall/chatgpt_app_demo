import { useJourneyData } from '../hooks/useJourneyData';
import { JOURNEY_IDS } from '../types/journey.types';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '@openai/apps-sdk-ui/components/Icon';
import { JourneyRenderer } from '../components/JourneyRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function PrescriptionsPage() {
    const journeyData = useJourneyData(JOURNEY_IDS.PRESCRIPTIONS);
    if (!journeyData) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-md mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to journeys</span>
                </Link>

                <JourneyRenderer data={journeyData} />
            </div>
        </div>
    );
}
