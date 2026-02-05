export type PokemonCardProps = {
    title: string,
    url: string | null
}

export default function PokemonCard({ title, url }: PokemonCardProps) {
    if (url === null || url === undefined || typeof (url) !== "string" || url.length === 0) return null

    return (
        <div className="min-w-[160px] select-none max-w-[160px] w-[40vw] sm:w-[160px] self-stretch flex flex-col">
            <div className="w-full">
                <img
                    src={url}
                    alt={title}
                    className="w-full aspect-square rounded-2xl object-cover ring ring-black/5 shadow-[1px_2px_6px_rgba(0,0,0,0.06)]"
                />
            </div>
            <div className="mt-3 flex flex-col flex-auto">
                <div className="text-base font-medium truncate line-clamp-1">{title}</div>
            </div>
        </div>
    )
}
