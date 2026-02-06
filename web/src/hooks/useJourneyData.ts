import { useOpenAiGlobal } from '../helpers/use-openai-global';
import { useToolOutput } from '../helpers/use-tool-output';
import type { JourneyData, JourneyId } from '../types/journey.types';

/**
 * Hook to get journey data from OpenAI or fallback to mock data
 * @param journeyId - The journey ID to fetch data for
 * @returns Journey data object
 */
export function useJourneyData(journeyId: JourneyId): JourneyData | null {
    // Primary: Try to get data from window.openai.toolOutput (set by ChatGPT's app iframe)
    const globalToolOutput = useOpenAiGlobal('toolOutput');

    // Fallback: Try postMessage-based tool output (for development/testing)
    const postMessageData = useToolOutput();

    // Check global toolOutput first (primary source from OpenAI ChatGPT app)
    if (globalToolOutput) {
        const output = globalToolOutput as { journey?: { journeyId?: string } };
        if (output?.journey?.journeyId === journeyId) {
            return output.journey as unknown as JourneyData;
        }
    }

    // Fallback to postMessage-based data (for local development)
    if (postMessageData?.journey?.journeyId === journeyId) {
        return postMessageData.journey as unknown as JourneyData;
    }

    return null;
}

/**
 * Hook to check if we're using live OpenAI data or mock data
 */
export function useIsLiveData(): boolean {
    const toolOutput = useOpenAiGlobal('toolOutput');
    return toolOutput !== null;
}