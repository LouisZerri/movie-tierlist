import { Movie } from "./movies";

export type TierListType = {
    id: number;
    tier: string;
    year: number;
    movie: Movie;
    position: number;
};