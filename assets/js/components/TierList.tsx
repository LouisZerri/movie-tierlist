import React, {useEffect} from "react";
import { Tier } from "../types/tier";
import { Movie } from "../types/movies";

type Props = {
    tiers: Tier[];
    onDropMovie: (tierLetter: string, movie: Movie) => void;
};

const TierList: React.FC<Props> = ({ tiers, onDropMovie }) => {

    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            const scrollMargin = 100; // px du haut ou bas de la page qui déclenche le scroll
            const scrollSpeed = 20; // px à scroller à chaque appel

            const { clientY } = e;

            const windowHeight = window.innerHeight;

            if (clientY < scrollMargin) {
                // Scroll vers le haut
                window.scrollBy(0, -scrollSpeed);
            } else if (clientY > windowHeight - scrollMargin) {
                // Scroll vers le bas
                window.scrollBy(0, scrollSpeed);
            }
        };

        window.addEventListener("dragover", handleDragOver);
        return () => window.removeEventListener("dragover", handleDragOver);
    }, []);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, tierLetter: string) => {
        const data = e.dataTransfer.getData("movie");
        if (data) {
            const movie: Movie = JSON.parse(data);
            onDropMovie(tierLetter, movie);
        }
    };

    return (
        <div className="space-y-6">
            {tiers.map(tier => (
                <div key={tier.letter}>
                    <div
                        className="flex items-center px-4 py-2 text-white text-xl font-bold"
                        style={{ backgroundColor: tier.color }}
                    >
                        {tier.letter} - {tier.title} · <span className="ml-2 text-sm font-normal">{tier.description}</span>
                    </div>
                    <div
                        className="flex flex-wrap gap-3 p-3 min-h-[120px]"
                        style={{ backgroundColor: tier.color }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, tier.letter)}
                    >
                        {tier.movies.map(movie => (
                            <a href={movie.imdbUrl} target="_blank" rel="noreferrer"  key={`tier-${tier.letter}-movie-${movie.id}`}>
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    title={movie.title}
                                    className="w-40 h-60 object-cover rounded shadow"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TierList;
