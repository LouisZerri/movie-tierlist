import { useState, useEffect } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Movie } from "../types/movies";
import { TierListType } from "../types/tierlist";
import { initialTiers, Tier, TierMovie } from "../types/tier";
import MovieService from "../services/MovieService";
import TierListService from "../services/TierListService";
import AdminService from "../services/AdminService";

export const useTierList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [selected, setSelected] = useState<number | null>(2025);
    const [tiers, setTiers] = useState<Tier[]>(initialTiers);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeMovie, setActiveMovie] = useState<TierMovie | Movie | null>(null);

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

    const fetchData = async () => {
        try {
            const auth = await AdminService.checkAuth();
            setIsAdmin(auth.isAdmin);
        } catch {
            setIsAdmin(false);
        }

        await fetchYears();

        if (selected === null) return;

        try {
            const entries: TierListType[] = await TierListService.getTierList(selected);
            const grouped = initialTiers.map(tier => ({
                ...tier,
                movies: entries
                    .filter((e: TierListType) => e.tier === tier.letter)
                    .sort((a: TierListType, b: TierListType) => a.position - b.position)
                    .map((e: TierListType) => ({ ...e.movie, tierListId: e.id })),
            }));
            setTiers(grouped);

            const allMovies: Movie[] = await MovieService.getMoviesByYear(selected);
            const placedIds = entries.map((e: TierListType) => e.movie.id);
            const filtered = allMovies.filter((m: Movie) => !placedIds.includes(m.id));
            setMovies(filtered);
        } catch (error) {
            console.error("Erreur pendant la récupération des données :", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selected]);

    const handleDragStart = (event: DragStartEvent) => {
        const { movie } = event.active.data.current as { movie: TierMovie | Movie };
        setActiveMovie(movie);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveMovie(null);

        if (!over || selected === null) return;

        const activeData = active.data.current as { movie: TierMovie; fromTier: string | null };
        const movie = activeData.movie;
        const fromTier = activeData.fromTier;

        const overId = over.id.toString();
        let toTier: string | null = null;
        let newPosition = 0;

        if (overId.startsWith('tier-')) {
            toTier = overId.replace('tier-', '');
            const tierMovies = tiers.find(t => t.letter === toTier)?.movies || [];
            newPosition = tierMovies.length;
        } else if (overId.startsWith('unplaced-')) {
            return;
        } else {
            const tierLetter = overId.split('-')[0];
            if (initialTiers.some(t => t.letter === tierLetter)) {
                toTier = tierLetter;
                const tierMovies = tiers.find(t => t.letter === toTier)?.movies || [];
                const overMovieId = parseInt(overId.split('-')[1]);
                const overIndex = tierMovies.findIndex((m: TierMovie) => m.id === overMovieId);
                newPosition = overIndex !== -1 ? overIndex : tierMovies.length;
            }
        }

        if (!toTier) return;

        // Réorganisation dans le même tier
        if (fromTier === toTier) {
            const activeId = active.id.toString();
            const overIdStr = over.id.toString();

            if (activeId !== overIdStr && !overIdStr.startsWith('tier-')) {
                const tierMovies = tiers.find(t => t.letter === fromTier)?.movies || [];
                const oldIndex = tierMovies.findIndex((m: TierMovie) => `${fromTier}-${m.id}` === activeId);
                const newIndex = tierMovies.findIndex((m: TierMovie) => `${fromTier}-${m.id}` === overIdStr);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newMovies = arrayMove(tierMovies, oldIndex, newIndex);

                    setTiers(prev =>
                        prev.map(tier => {
                            if (tier.letter !== fromTier) return tier;
                            return { ...tier, movies: newMovies };
                        })
                    );

                    try {
                        for (let i = 0; i < newMovies.length; i++) {
                            const m: TierMovie = newMovies[i];
                            if (m.tierListId) {
                                await TierListService.updateTierPosition(m.tierListId, fromTier, i);
                            }
                        }
                    } catch (error) {
                        console.error("Erreur lors de la mise à jour des positions:", error);
                    }
                }
            }
            return;
        }

        // Déplacement vers un autre tier
        try {
            if (fromTier) {
                const fromTierMovies = tiers.find(t => t.letter === fromTier)?.movies || [];
                const toTierMovies = tiers.find(t => t.letter === toTier)?.movies || [];

                const newFromMovies = fromTierMovies.filter((m: TierMovie) => m.id !== movie.id);
                const newToMovies = [...toTierMovies];
                newToMovies.splice(newPosition, 0, movie as TierMovie);

                setTiers(prev =>
                    prev.map(tier => {
                        if (tier.letter === fromTier) return { ...tier, movies: newFromMovies };
                        if (tier.letter === toTier) return { ...tier, movies: newToMovies };
                        return tier;
                    })
                );

                if ((movie as TierMovie).tierListId) {
                    await TierListService.updateTierPosition((movie as TierMovie).tierListId!, toTier, newPosition);
                }

                await Promise.all(
                    newFromMovies.map((m: TierMovie, index: number) =>
                        m.tierListId ? TierListService.updateTierPosition(m.tierListId, fromTier, index) : Promise.resolve()
                    )
                );

                await Promise.all(
                    newToMovies.map((m: TierMovie, index: number) =>
                        m.tierListId && m.id !== movie.id ? TierListService.updateTierPosition(m.tierListId, toTier, index) : Promise.resolve()
                    )
                );
            } else {
                const toTierMovies = tiers.find(t => t.letter === toTier)?.movies || [];
                const res = await TierListService.addToTierList(selected, toTier, movie.id, newPosition);

                const newToMovies = [...toTierMovies];
                newToMovies.splice(newPosition, 0, { ...movie, tierListId: res?.id } as TierMovie);

                setTiers(prev =>
                    prev.map(tier =>
                        tier.letter === toTier ? { ...tier, movies: newToMovies } : tier
                    )
                );

                setMovies(prev => prev.filter((m: Movie) => m.id !== movie.id));

                await Promise.all(
                    newToMovies.map((m: TierMovie, index: number) =>
                        m.tierListId && m.id !== movie.id ? TierListService.updateTierPosition(m.tierListId, toTier, index) : Promise.resolve()
                    )
                );
            }
        } catch (error) {
            console.error("Erreur lors du déplacement:", error);
        }
    };

    const resetCurrentTier = async () => {
        if (selected === null) return;
        await TierListService.deleteTierListOfYear(selected);

        setTiers(initialTiers.map(tier => ({ ...tier, movies: [] })));

        const allMovies: Movie[] = await MovieService.getMoviesByYear(selected);
        setMovies(allMovies);

        alert("Tier list supprimé avec succès");
    };

    const logout = async () => {
        await AdminService.logout();
        setIsAdmin(false);
    };

    return {
        movies,
        years,
        selected,
        setSelected,
        tiers,
        isAdmin,
        activeMovie,
        handleDragStart,
        handleDragEnd,
        resetCurrentTier,
        logout,
    };
};