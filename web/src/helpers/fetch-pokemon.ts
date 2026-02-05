import { setOpenAIGlobal } from "./set-openai-global";
import type { InputSchema } from "./use-tool-input";

export async function getPokemon(name: string) {
    // console.log("get pokemon: ", name)
    const toolInput: InputSchema = { name }

    setOpenAIGlobal("toolInput", toolInput)
    setOpenAIGlobal("toolOutput", null)
    const response = await window.openai?.callTool("get_pokemon", { name: name });

    // response will have the following key.
    // - _meta: null
    // - content: [Object] (1)
    // - isError: false
    // - meta: null (or anything returned from the server tool call in the _meta field. NOTE: those are not included in the _meta key above.)
    // - result: "{\"result\":{\"abilities\":[{\"ability\":{\"name\":\"torrent\",\"url\":\"https://pokeapi.co/api/v2/ability/67/\"},\"is_hidden\":false,\"slot\":1},{\"ability\":{…"
    // - structuredContent: {result: Object}

    if ("structuredContent" in response) {
        setOpenAIGlobal("toolOutput", response["structuredContent"] as any)
    } else {
        const jsonResult = JSON.parse(response.result)
        setOpenAIGlobal("toolOutput", jsonResult)
    }
    if ("meta" in response && response["meta"] !== null) {
        setOpenAIGlobal("toolResponseMetadata", response["meta"] as any)
    } else if ("_meta" in response && response["_meta"] !== null) {
        setOpenAIGlobal("toolResponseMetadata", response["_meta"] as any)
    }
}
