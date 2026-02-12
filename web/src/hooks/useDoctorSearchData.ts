import { useOpenAiGlobal } from '../helpers/use-openai-global';
import { useEffect, useState } from 'react';
import type { DoctorSearchResult } from '../types/doctor-search.types';

/**
 * Hook to get doctor search data from OpenAI toolOutput
 */
export function useDoctorSearchData(): DoctorSearchResult | null {
    // Primary: from window.openai.toolOutput
    const globalToolOutput = useOpenAiGlobal('toolOutput');

    // Fallback: postMessage-based
    const [postMessageData, setPostMessageData] = useState<DoctorSearchResult | null>(null);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.source !== window.parent && event.source !== window) return;
            const message = event.data;
            if (!message || message.jsonrpc !== '2.0') return;
            if (message.method !== 'ui/notifications/tool-result') return;

            const params = message.params as { structuredContent?: { doctorSearch?: DoctorSearchResult } } | null;
            if (params?.structuredContent?.doctorSearch) {
                setPostMessageData(params.structuredContent.doctorSearch);
            }
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // Check global toolOutput first
    if (globalToolOutput) {
        const output = globalToolOutput as { doctorSearch?: DoctorSearchResult };
        if (output?.doctorSearch) {
            return output.doctorSearch;
        }
    }

    return postMessageData;
}
