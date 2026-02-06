import {mockJourneyData} from '../data';
import type {JourneyData, JourneyId} from '../types/journey.types';
import {
    SET_GLOBALS_EVENT_TYPE,
    SetGlobalsEvent,
    type DisplayMode,
} from './types';

// MCP Server URL for local development
const MCP_SERVER_URL = 'http://localhost:3000/mcp';

// Check if we're in development mode
export const isDev = import.meta.env.DEV;

// Tool name to journey ID mapping
const TOOL_TO_JOURNEY: Record<string, JourneyId> = {
    get_claims: 'claims',
    get_doctors: 'find-doctor',
    get_plan_benefits: 'plan-benefits',
    get_prescriptions: 'prescriptions',
};

// Journey ID to tool name mapping
export const JOURNEY_TO_TOOL: Record<JourneyId, string> = {
    claims: 'get_claims',
    'find-doctor': 'get_doctors',
    'plan-benefits': 'get_plan_benefits',
    prescriptions: 'get_prescriptions',
};

/**
 * Simulate calling a tool and getting a response
 * Can use mock data or call the actual MCP server
 */
export async function simulateToolCall(
    toolName: string,
    args: Record<string, unknown> = {},
    options: { useMockData?: boolean } = {}
): Promise<{ journey: JourneyData } | null> {
    debugger;
    const {useMockData = true} = options;

    const journeyId = TOOL_TO_JOURNEY[toolName];
    if (!journeyId) {
        console.warn(`Unknown tool: ${toolName}`);
        return null;
    }

    if (useMockData) {
        const data = mockJourneyData[journeyId];
        return data ? {journey: data} : null;
    }

    try {
        const response = await fetch(MCP_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/event-stream',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: toolName,
                    arguments: args,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`MCP server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        const content = result.result?.content?.[0];
        if (content?.type === 'text') {
            return JSON.parse(content.text);
        }

        return result.result?.structuredContent || null;
    } catch (error) {
        console.error('MCP server call failed, falling back to mock data:', error);
        const data = mockJourneyData[journeyId];
        return data ? {journey: data} : null;
    }
}

/**
 * Set the simulated tool output in window.openai
 */
export function setSimulatedToolOutput(
    toolOutput: { journey: JourneyData } | null,
    metadata: Record<string, unknown> = {}
) {
    if (!window.openai) return;

    window.openai.toolOutput = toolOutput;
    window.openai.toolResponseMetadata = metadata;

    const event = new SetGlobalsEvent(SET_GLOBALS_EVENT_TYPE, {
        detail: {
            globals: {
                toolOutput,
                toolResponseMetadata: metadata,
            },
        },
    });
    window.dispatchEvent(event);
}

/**
 * Initialize the development simulator
 * Creates a mock window.openai object with simulated APIs
 */
export function initDevSimulator() {
    if (window.openai?.callTool) {
        console.log('Using existing window.openai (embedded simulation or ChatGPT)');
        exposeDevSimulatorHelpers();
        return;
    }

    if (!isDev) {
        console.log('Dev simulator only available in development mode');
        return;
    }

    console.log('Initializing MCP Dev Simulator');

    const mockOpenAi: Partial<typeof window.openai> = {
        theme: 'light',
        locale: 'en-US',
        maxHeight: 800,
        displayMode: 'inline' as DisplayMode,
        safeArea: {insets: {top: 0, bottom: 0, left: 0, right: 0}},
        userAgent: {
            device: {type: 'desktop'},
            capabilities: {hover: true, touch: false},
        },

        toolInput: {},
        toolOutput: null,
        toolResponseMetadata: null,
        widgetState: null,

        callTool: async (name: string, args: Record<string, unknown>) => {
            console.log(`Dev Simulator: callTool("${name}")`, args);
            const result = await simulateToolCall(name, args, {useMockData: false});
            if (result) {
                setSimulatedToolOutput(result, {simulated: true});
            }
            return {result: JSON.stringify(result)};
        },

        sendFollowUpMessage: async ({prompt}) => {
            console.log(`Dev Simulator: sendFollowUpMessage("${prompt}")`);
        },

        openExternal: ({href}) => {
            console.log(`Dev Simulator: openExternal("${href}")`);
            window.open(href, '_blank');
        },

        requestDisplayMode: async ({mode}) => {
            console.log(`Dev Simulator: requestDisplayMode("${mode}")`);
            if (window.openai) {
                window.openai.displayMode = mode;
            }
            return {mode};
        },

        setWidgetState: async (state) => {
            console.log('Dev Simulator: setWidgetState', state);
            if (window.openai) {
                window.openai.widgetState = state;
            }
        },
    };

    window.openai = mockOpenAi as typeof window.openai;

    console.log('Dev Simulator ready. Available tools:', Object.keys(TOOL_TO_JOURNEY));
    console.log('Use window.devSimulator.callTool() to test tools');

    exposeDevSimulatorHelpers();
}

/**
 * Expose helper functions globally for console testing
 */
function exposeDevSimulatorHelpers() {
    (window as any).devSimulator = {
        callTool: async (toolName: string, args: Record<string, unknown> = {}) => {
            const result = await simulateToolCall(toolName, args, {useMockData: false});
            if (result) {
                setSimulatedToolOutput(result, {simulated: true});
            }
            return result;
        },

        callToolMock: async (toolName: string) => {
            const result = await simulateToolCall(toolName, {}, {useMockData: true});
            if (result) {
                setSimulatedToolOutput(result, {simulated: true, mock: true});
            }
            return result;
        },

        setJourney: (journeyId: JourneyId) => {
            const data = mockJourneyData[journeyId];
            if (data) {
                setSimulatedToolOutput({journey: data}, {simulated: true, mock: true});
            }
            return data;
        },

        clearToolOutput: () => {
            setSimulatedToolOutput(null);
        },

        listTools: () => Object.keys(TOOL_TO_JOURNEY),
        listJourneys: () => Object.keys(JOURNEY_TO_TOOL),
    };
}

/**
 * Get list of available simulated tools
 */
export function getAvailableTools() {
    return Object.entries(TOOL_TO_JOURNEY).map(([tool, journey]) => ({
        tool,
        journey,
        description: `Get ${journey.replace('-', ' ')} data`,
    }));
}
