import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Tier } from "../../types/tier";
import SortableMovie from "../movies/SortableMovie";

type Props = {
    tier: Tier;
};

const TierRowAdmin: React.FC<Props> = ({ tier }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `tier-${tier.letter}`,
        data: { tierLetter: tier.letter }
    });

    return (
        <div>
            <div
                className="flex items-center px-4 py-2 text-white text-xl font-bold"
                style={{ backgroundColor: tier.color }}
            >
                {tier.letter} - {tier.title} · <span className="ml-2 text-sm font-normal">{tier.description}</span>
            </div>
            <SortableContext
                items={tier.movies.map(m => `${tier.letter}-${m.id}`)}
                strategy={horizontalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={`flex flex-wrap gap-3 p-3 min-h-[140px] transition-all ${isOver ? 'brightness-125 ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: tier.color }}
                >
                    {tier.movies.length === 0 ? (
                        <div className="text-white/50 flex items-center justify-center w-full">
                            Déposez un film ici
                        </div>
                    ) : (
                        tier.movies.map(movie => (
                            <SortableMovie
                                key={`${tier.letter}-${movie.id}`}
                                movie={movie}
                                tierLetter={tier.letter}
                            />
                        ))
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default TierRowAdmin;