import planBenefitsData from './plan-benefit.mock.json';
import findDoctorData from './find-doctor.mock.json';
import claimsData from './claims.mock.json';
import prescriptionsData from './prescriptions.mock.json';
import type { JourneyData, JourneyId } from '../types/journey.types';
import { JOURNEY_IDS } from '../types/journey.types';

export const mockJourneyData: Record<JourneyId, JourneyData> = {
    [JOURNEY_IDS.PLAN_BENEFITS]: planBenefitsData as JourneyData,
    [JOURNEY_IDS.FIND_DOCTOR]: findDoctorData as JourneyData,
    [JOURNEY_IDS.CLAIMS]: claimsData as JourneyData,
    [JOURNEY_IDS.PRESCRIPTIONS]: prescriptionsData as JourneyData,
};

export const journeyList = [
    mockJourneyData[JOURNEY_IDS.PLAN_BENEFITS],
    mockJourneyData[JOURNEY_IDS.FIND_DOCTOR],
    mockJourneyData[JOURNEY_IDS.CLAIMS],
    mockJourneyData[JOURNEY_IDS.PRESCRIPTIONS],
];
