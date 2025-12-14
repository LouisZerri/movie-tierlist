import React from "react";
import { useNavigate } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    pointerWithin,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { useTierList } from "../hooks/useTierList";
import TierList from "./tierlist/TierList";
import YearSlider from "./YearSlider";
import SortableUnplacedMovie from "./movies/SortableUnplacedMovie";
import StaticMovie from "./movies/StaticMovie";
import { Movie } from "../types/movies";

const Movies: React.FC = () => {
    const navigate = useNavigate();
    const {
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
    } = useTierList();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const AdminButtons = () => (
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
    );

    const UnplacedMovies = () => (
        <div className="flex flex-wrap gap-4 justify-center mt-10">
            {movies.map((movie: Movie) => (
                <StaticMovie key={movie.id} movie={movie} />
            ))}
        </div>
    );

    const DraggableUnplacedMovies = () => (
        <SortableContext
            items={movies.map(m => `unplaced-${m.id}`)}
            strategy={rectSortingStrategy}
        >
            <div className="flex flex-wrap gap-4 justify-center mt-10">
                {movies.map((movie: Movie) => (
                    <SortableUnplacedMovie key={movie.id} movie={movie} />
                ))}
            </div>
        </SortableContext>
    );

    const Content = () => (
        <div className="p-6 text-white">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {isAdmin && <AdminButtons />}
                </div>
                <YearSlider years={years} selected={selected} onChange={setSelected} />
            </div>

            <TierList tiers={tiers} isAdmin={isAdmin} />

            {isAdmin ? <DraggableUnplacedMovies /> : <UnplacedMovies />}
        </div>
    );

    if (isAdmin) {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Content />
                <DragOverlay>
                    {activeMovie && (
                        <img
                            src={activeMovie.poster}
                            alt={activeMovie.title}
                            className="w-40 h-60 object-cover rounded shadow-lg opacity-90"
                        />
                    )}
                </DragOverlay>
            </DndContext>
        );
    }

    return <Content />;
};

export default Movies;