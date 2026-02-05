import { useOpenAiGlobal } from "./use-openai-global";
import { z } from 'zod'

export function useToolOutput(): StructuredOutput | null {
    const output = useOpenAiGlobal('toolOutput')
    if (output === null) {
        return null
    }
    try {
        return StructuredOutput.parse(output)
    } catch (error) {
        console.error(error)
        return null
    }
}


export const StructuredOutput = z.object({
    result: z.object({
        name: z.string(),
        id: z.number().int(),
        height: z.number().int(),
        weight: z.number().int(),
        types: z.array(
            z.object({
                slot: z.number().int(),
                type: z.object({
                    name: z.string(),
                    url: z.url(),
                })
            }).loose()
        ),
        // sprites: z.object({
        //     back_default: z.url().nullable(),
        //     back_female: z.url().nullable(),
        //     back_shiny: z.url().nullable(),
        //     back_shiny_female: z.url().nullable(),
        //     front_default: z.url().nullable(),
        //     front_female: z.url().nullable(),
        //     front_shiny: z.url().nullable(),
        //     front_shiny_female: z.url().nullable(),
        // }).loose()
    }).loose()
})

export type StructuredOutput = z.infer<typeof StructuredOutput>
