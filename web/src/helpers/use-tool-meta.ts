import { useOpenAiGlobal } from "./use-openai-global";
import { z } from 'zod'

export function useToolOutputMeta(): OutputMeta | null {
    const meta = useOpenAiGlobal('toolResponseMetadata')
    if (meta === null) {
        return null
    }
    try {
        return OutputMeta.parse(meta)
    } catch (error) {
        console.error(error)
        return null
    }
}


export const OutputMeta = z.object({
    sprites: z.object({
        back_default: z.url().nullable(),
        back_female: z.url().nullable(),
        back_shiny: z.url().nullable(),
        back_shiny_female: z.url().nullable(),
        front_default: z.url().nullable(),
        front_female: z.url().nullable(),
        front_shiny: z.url().nullable(),
        front_shiny_female: z.url().nullable(),
    }).loose()
}).loose()

export type OutputMeta = z.infer<typeof OutputMeta>
