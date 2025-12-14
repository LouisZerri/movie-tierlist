import { Movie } from "./movies";

export interface TierMovie extends Movie {
    tierListId?: number;
}

export type Tier = {
    letter: string;
    title: string;
    description: string;
    color: string;
    movies: TierMovie[];
}

export const initialTiers: Tier[] = [
    { letter: 'S', title: 'Chef-d\'œuvre', description: 'Film qu\'il faut absolument voir', color: '#4f39f6', movies: []},
    { letter: 'A', title: 'Excellent', description: 'Un excellent moment, je recommande', color: '#008236', movies: []},
    { letter: 'B', title: 'Très Bon', description: 'J\'ai bien aimé, il y a un petit truc en plus', color: '#5ea500', movies: []},
    { letter: 'C', title: 'Bon', description: 'Objectivement, c\'est pas terrible mais j\'ai quand même aimé', color: '#cf8700', movies: []},
    { letter: 'D', title: 'Moyen', description: 'C\'est pas chiant, ni une purge, maic c\'est pas fou', color: '#bb4d00', movies: []},
    { letter: 'E', title: 'Pas Bon', description: 'Trop générique ou je n\'ai pas été réceptif', color: '#c20008', movies: []},
    { letter: 'F', title: 'Mauvais', description: 'Perte de temps totale, pourquoi j\'ai regardé ça', color: '#364153', movies: []},
]