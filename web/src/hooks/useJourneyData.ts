import {useOpenAiGlobal} from '../helpers/use-openai-global';
import {mockJourneyData} from '../data';
import type {JourneyData, JourneyId} from '../types/journey.types';

/**
 * Hook to get journey data from OpenAI or fallback to mock data
 * @param journeyId - The journey ID to fetch data for
 * @returns Journey data object
 */
export function useJourneyData(journeyId: JourneyId): JourneyData | null {
    // Try to get data from OpenAI first
    const toolOutput = useOpenAiGlobal('toolOutput');
    const toolMeta = useOpenAiGlobal('toolResponseMetadata');

    // Check if OpenAI provided journey data matching this journeyId
    if (toolOutput && toolMeta) {
        try {
            // If the OpenAI response has journey data for this journey, use it
            const openAiData = toolOutput as unknown as { journey?: JourneyData };
            if (openAiData?.journey?.journeyId === journeyId) {
                return openAiData.journey;
            }
        } catch {
            // Fall through to mock data
        }
    }

    // Fallback to mock data for local development
    return mockJourneyData[journeyId] ?? null;
}

/**
 * Hook to check if we're using live OpenAI data or mock data
 */
export function useIsLiveData(): boolean {
    const toolOutput = useOpenAiGlobal('toolOutput');
    return toolOutput !== null;
}