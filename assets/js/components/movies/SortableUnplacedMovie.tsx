import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Movie } from "../../types/movies";
import MovieCard from "./MovieCard";

type Props = {
    movie: Movie;
};

const SortableUnplacedMovie: React.FC<Props> = ({ movie }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `unplaced-${movie.id}`,
        data: { movie, fromTier: null }
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
            <MovieCard movie={movie} isDragging={isDragging} />
        </div>
    );
};

export default SortableUnplacedMovie;