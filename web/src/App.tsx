import { useMemo, useState } from 'react'
import { InputSchema, useToolInput } from './helpers/use-tool-input'
import { StructuredOutput, useToolOutput } from './helpers/use-tool-output'
import PokemonCard from './Card'
import useEmblaCarousel from "embla-carousel-react"
import { getPokemon } from './helpers/fetch-pokemon'
import { useToolOutputMeta, type OutputMeta } from './helpers/use-tool-meta'

const recommended = ["pikachu", "bulbasaur", "charmander", "squirtle"]

function App() {
    const toolInput: InputSchema | null = useToolInput()
    const toolOutput: StructuredOutput | null = useToolOutput()
    const toolMeta: OutputMeta | null = useToolOutputMeta()

    const [emblaRef, _emblaApi] = useEmblaCarousel({
        align: "center",
        loop: false,
        containScroll: "trimSnaps",
        slidesToScroll: "auto",
        dragFree: false,
    })

    const [name, setName] = useState("")
    const [followUp, setFollowUp] = useState("")
    const [error, setError] = useState("")

    const isLoading: boolean = useMemo(() => {
        return toolOutput === null && error === ""
    }, [toolOutput, error])

    const sprites: { title: string, url: string | null }[] | null = useMemo(() => {
        const sprites = toolMeta?.sprites
        if (!sprites) {
            return null
        }
        const array = Object.keys(sprites).map(function (title) {
            let url: string | null = sprites[title] as string | null
            return {
                title: title,
                url: url
            }
        })

        return array

    }, [toolOutput])

    async function getPokemonHelper(name: string) {
        setError("")
        try {
            await getPokemon(name)
        } catch (error) {
            console.error(error)
            setError("Oops, something went wrong! Please check try again later!")
        }
    }

    async function sendFollowUp(message: string) {
        setError("")
        try {
            await window.openai?.sendFollowUpMessage({ prompt: message })
        } catch (error) {
            console.error(error)
            setError("Oops, something went wrong! Please check try again later!")
        }
    }

    return (
        <div className='flex flex-col gap-4 bg-amber-100 border rounded-md border-amber-700 text-black p-4' >
            <div className='flex flex-col gap-2'>
                <h2 className="font-semibold">Recommended Pokemons</h2>
                <div className="antialiased relative w-full flex flex-row gap-2">
                    {recommended.map((pokemon) => (
                        <button
                            className="border rounded-md border-black bg-white py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            onClick={async () => await getPokemonHelper(pokemon)}
                            key={pokemon}
                        >{pokemon == "pikachu" ? `⭐ ${pokemon} ⭐` : pokemon}</button>
                    ))}
                </div>
            </div>

            <div className='flex flex-row gap-2 items-center'>
                <h2 className="font-semibold">Search</h2>
                <input onChange={(event) => setName(event.target.value)} className='py-1 px-2 border rounded-md' />
                <button
                    className="border rounded-md border-black bg-white py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={async () => {
                        await getPokemonHelper(name)
                        setName("")
                    }}>Go</button>
            </div>

            <div className='flex flex-row gap-2 items-center'>
                <h2 className="font-semibold">Ask More</h2>
                <input onChange={(event) => setFollowUp(event.target.value)} className='py-1 px-2 border rounded-md' />
                <button
                    className="border rounded-md border-black bg-white py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={async () => {
                        await sendFollowUp(followUp)
                        setFollowUp("")
                    }}>Send</button>
            </div>

            <div className='flex flex-col gap-2'>
                <h2 className="font-semibold">Pokemon: {toolOutput?.result?.name}</h2>
                {
                    toolOutput === null ?
                        error !== "" ? <div className="text-red-400">{error}</div> : <div className='text-gray-400'>Loading...</div> :
                        <div className='flex flex-col gap-1 text-sm'>
                            <p>Id: {toolOutput.result.id}</p>
                            <p>Height: {toolOutput.result.height}</p>
                            <p>Weight: {toolOutput.result.weight}</p>
                            <p>Type: {toolOutput.result.types.map((t) => t.type.name).join(", ")}</p>
                        </div>
                }

                {
                    (sprites !== null && sprites.length > 0) ?
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex flex-row gap-2 max-sm:mx-5 items-stretch">
                                {sprites?.map((sprite) => (
                                    <PokemonCard key={sprite.title} url={sprite.url} title={sprite.title} />
                                ))}
                            </div>
                        </div>
                        : null
                }
            </div>

        </div>
    )
}

export default App
