import React from "react";
import { Movie } from "../../types/movies";

type Props = {
    movie: Movie;
    isDragging?: boolean;
    showTooltip?: boolean;
};

const MovieCard: React.FC<Props> = ({ movie, isDragging = false, showTooltip = true }) => {
    return (
        <div className="relative group">
            <img
                src={movie.poster}
                alt={movie.title}
                title={movie.title}
                onClick={(e) => {
                    e.stopPropagation();
                    window.open(movie.imdbUrl, '_blank');
                }}
                className={`w-40 h-60 object-cover rounded shadow hover:scale-105 transition-transform duration-200 cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
            />
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-900 text-white text-sm rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <strong>{movie.title}</strong><br />
                    {movie.year} · {movie.director}
                </div>
            )}
        </div>
    );
};

export default MovieCard;