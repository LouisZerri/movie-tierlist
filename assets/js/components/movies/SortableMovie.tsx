import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TierMovie } from "../../types/tier";
import MovieCard from "./MovieCard";

type Props = {
    movie: TierMovie;
    tierLetter: string;
};

const SortableMovie: React.FC<Props> = ({ movie, tierLetter }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `${tierLetter}-${movie.id}`,
        data: { movie, fromTier: tierLetter }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <MovieCard movie={movie} isDragging={isDragging} showTooltip={false} />
        </div>
    );
};

export default SortableMovie;