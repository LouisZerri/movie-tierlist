import React from "react";
import { Tier } from "../../types/tier";
import StaticMovie from "../movies/StaticMovie";

type Props = {
    tier: Tier;
};

const TierRowStatic: React.FC<Props> = ({ tier }) => {
    return (
        <div>
            <div
                className="flex items-center px-4 py-2 text-white text-xl font-bold"
                style={{ backgroundColor: tier.color }}
            >
                {tier.letter} - {tier.title} · <span className="ml-2 text-sm font-normal">{tier.description}</span>
            </div>
            <div
                className="flex flex-wrap gap-3 p-3 min-h-[140px]"
                style={{ backgroundColor: tier.color }}
            >
                {tier.movies.map(movie => (
                    <StaticMovie key={`${tier.letter}-${movie.id}`} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default TierRowStatic;