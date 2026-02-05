import { useOpenAiGlobal } from "./use-openai-global";
import { z } from 'zod'

export function useToolInput(): InputSchema | null {
    const input = useOpenAiGlobal('toolInput')
    if (input === null) {
        return null
    }
    try {
        return InputSchema.parse(input)
    } catch (error) {
        console.error(error)
        return null
    }
}


export const InputSchema = z.object({ name: z.string().nonempty() })
export type InputSchema = z.infer<typeof InputSchema>
