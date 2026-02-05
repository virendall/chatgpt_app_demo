import {
    SET_GLOBALS_EVENT_TYPE,
    SetGlobalsEvent,
    type OpenAiGlobals,
} from "./types";

export function setOpenAIGlobal<K extends keyof OpenAiGlobals>(
    key: K,
    value: OpenAiGlobals[K] | null
) {
    if (window.openai !== null && window.openai !== undefined) {

        window.openai[key] = value as any

        const event = new SetGlobalsEvent(SET_GLOBALS_EVENT_TYPE, {
            detail: {
                globals: {
                    [key]: value
                }
            }
        })

        window.dispatchEvent(event)
    }
}
