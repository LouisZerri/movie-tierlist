import React, { useEffect, useState } from "react";
import MovieService from "../services/MovieService";
import YearSlider from "../components/YearSlider";
import TierList from "./TierList";
import { Movie } from "../types/movies";
import {TierListType} from "../types/tierlist";
import { initialTiers, Tier } from "../types/tier";
import TierListService from "../services/TierListService";
import {useNavigate} from "react-router-dom";
import AdminService from "../services/AdminService";

const Movies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    const [years, setYears] = useState<number[]>([]);
    const [selected, setSelected] = useState<number | null>(2025);
    const [tiers, setTiers] = useState<Tier[]>(initialTiers);

    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    // Récupérer toutes les années (entre la date du plus ancien film au plus récent)
    const fetchYears = async () => {
        try {
            const fetchedYears: number[] = await MovieService.getAllYear();
            const sortedYears = fetchedYears.sort((a, b) => a - b);
            setYears(sortedYears);
            setSelected(prev => prev ?? sortedYears[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchEverything = async () => {
            try {
                // 1. Vérifie si l'utilisateur est admin
                const auth = await AdminService.checkAuth();
                setIsAdmin(auth.isAdmin);

                // 2. Récupère toutes les années disponibles
                await fetchYears();

                // 3. Ne continue que si une année est sélectionnée
                if (selected === null) return;

                // 4. Récupère la tier list de l'année sélectionnée
                const entries: TierListType[] = await TierListService.getTierList(selected);
                const grouped = initialTiers.map(tier => ({
                    ...tier,
                    movies: entries
                        .filter((e) => e.tier === tier.letter)
                        .map((e) => e.movie),
                }));
                setTiers(grouped);

                // 5. Récupère tous les films de l'année
                const allMovies: Movie[] = await MovieService.getMoviesByYear(selected);

                // 6. Enlève ceux déjà placés dans la tierlist
                const placedIds = entries.map(e => e.movie.id);
                const filtered = allMovies.filter(m => !placedIds.includes(m.id));
                setMovies(filtered);

            } catch (error) {
                console.error("Erreur pendant la récupération des données :", error);
                setIsAdmin(false); // Si erreur auth, on considère invité
            }
        };

        fetchEverything();
    }, [selected]);


    const addToTier = async (tierLetter: string, movie: Movie) => {

        if(selected === null) return;

        await TierListService.addToTierList(selected, tierLetter, movie.id)

        setTiers(prev =>
            prev.map(tier =>
                tier.letter === tierLetter && !tier.movies.find(m => m.id === movie.id)
                    ? { ...tier, movies: [...tier.movies, movie] }
                    : tier
            )
        );

        setMovies(prev => prev.filter(m => m.id !== movie.id));
    };

    const resetCurrentTier = async () => {
        if (selected === null) return;
        await TierListService.deleteTierListOfYear(selected);

        // Recharge tout
        const grouped = initialTiers.map(tier => ({
            ...tier,
            movies: [],
        }));
        setTiers(grouped);

        const allMovies: Movie[] = await MovieService.getMoviesByYear(selected);
        setMovies(allMovies);

        alert("Tier list supprimé avec succès")
    };

    const handleLogout = async () => {
        try {
            await AdminService.logout();
            setIsAdmin(false);
            navigate('/');
        } catch (err) {
            console.error("Erreur lors de la déconnexion", err);
        }
    };

    return (
        <div className="p-6 text-white">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <div className="flex gap-4">
                            <button
                                onClick={resetCurrentTier}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded"
                            >
                                Réinitialiser la Tier List de {selected}
                            </button>

                            <button
                                onClick={() => navigate("/ajouter-film")}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded"
                            >
                                Ajouter un film
                            </button>

                            <button
                                onClick={handleLogout}
                                className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded"
                            >
                                Déconnexion
                            </button>
                        </div>
                    )}

                </div>

                <YearSlider
                    years={years}
                    selected={selected}
                    onChange={setSelected}
                />
            </div>

            <TierList tiers={tiers} onDropMovie={addToTier} />

            <div className="flex flex-wrap gap-4 justify-center mt-10">
                {movies
                    .filter(movie => !tiers.some(tier => tier.movies.some(m => m.id === movie.id)))
                    .map((movie) => (
                        <div
                            key={movie.id}
                            className="relative group cursor-move"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("movie", JSON.stringify(movie))}
                        >
                            <a href={movie.imdbUrl} target="_blank" rel="noreferrer" key={movie.imdbUrl}>
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-40 h-60 object-cover rounded shadow hover:scale-105 transition-transform duration-200"
                                />
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-900 text-white text-sm rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                                <strong>{movie.title}</strong><br />
                                {movie.year} · {movie.director}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Movies;