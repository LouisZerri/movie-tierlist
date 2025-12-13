import Axios from 'axios';
import {Movie} from "../types/movies";
import { MOVIES_API } from '../config';


// Recupérer toutes les années des films
function getAllYear(): Promise<number[]> {
    return Axios.get(`${MOVIES_API}/years`).then(
        (response) => response.data as number[]
    )
}

// Récupérer tout les films en fonction d'une année précise
function getMoviesByYear(year: number): Promise<Movie[]> {
    return Axios.get(`${MOVIES_API}?year=${year}`).then(
        (response) => response.data.member as Movie[]
    )
}

// Ajouter un film dans l'API
function addMovie(movie: Partial<Movie>): Promise<void> {
    return Axios.post(MOVIES_API, movie, {
        headers: {
            'Content-Type': 'application/ld+json'
        }
    })
}


export default {
    getAllYear,
    getMoviesByYear,
    addMovie
}