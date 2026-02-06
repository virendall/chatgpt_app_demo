import { useEffect, useState } from 'react';
import { z } from 'zod';

const JourneyDataSchema = z.object({
    journeyId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
}).passthrough();

const StructuredOutput = z.object({
    journey: JourneyDataSchema,
});

type ToolResult = { structuredContent?: unknown } | null;

export function useToolOutput() {
    const [toolResult, setToolResult] = useState<ToolResult>(null);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            // For local dev (no iframe), event.source might be window
            // For prod (iframe), event.source is window.parent
            if (event.source !== window.parent && event.source !== window) return;

            const message = event.data;
            if (!message || message.jsonrpc !== "2.0") return;
            if (message.method !== "ui/notifications/tool-result") return;

            setToolResult(message.params ?? null);
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    if (!toolResult?.structuredContent) return null;

    try {
        return StructuredOutput.parse(toolResult.structuredContent);
    } catch (e) {
        console.error('Failed to parse tool output:', e);
        return null;
    }
}
