import React from "react";
import { Movie } from "../../types/movies";
import MovieCard from "./MovieCard";

type Props = {
    movie: Movie;
};

const StaticMovie: React.FC<Props> = ({ movie }) => {
    return <MovieCard movie={movie} />;
};

export default StaticMovie;