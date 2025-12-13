import React, {useState} from "react";
import MovieService from "../services/MovieService";
import {useNavigate} from "react-router-dom";

const Admin: React.FC = () => {

    const [title, setTitle] = useState<string>("");
    const [year, setYear] = useState<number>(0);
    const [director, setDirector] = useState<string>("");
    const [imdbUrl, setImdbUrl] = useState<string>("");
    const [poster, setPoster] = useState<string>("");

    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(title, year, director, imdbUrl, poster);
        try {
            await MovieService.addMovie({
                title: title,
                year: year,
                director: director,
                imdbUrl: imdbUrl,
                poster: poster
            })

            alert("Film ajouté avec succès")
            navigate("/")
        } catch(error) {
            console.log(error);
        }

    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="bg-gray-200 rounded-lg shadow-lg p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">🎬 Ajouter un film</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="titre" className="w-1/4 text-right text-black font-medium">Titre</label>
                        <input
                            type="text"
                            id="titre"
                            placeholder="Titre du film"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-3/4 p-2 rounded border border-gray-400 text-black"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="annee" className="w-1/4 text-right text-black font-medium">Année</label>
                        <input
                            type="number"
                            id="annee"
                            placeholder="Année"
                            value={year}
                            onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : 0)}
                            className="w-3/4 p-2 rounded border border-gray-400 text-black"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="realisateur" className="w-1/4 text-right text-black font-medium">Réalisateur</label>
                        <input
                            type="text"
                            id="realisateur"
                            placeholder="Nom du réalisateur"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            className="w-3/4 p-2 rounded border border-gray-400 text-black"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="poster" className="w-1/4 text-right text-black font-medium">Affiche</label>
                        <input
                            type="text"
                            id="poster"
                            placeholder="URL de l'affiche"
                            value={poster}
                            onChange={(e) => setPoster(e.target.value)}
                            className="w-3/4 p-2 rounded border border-gray-400 text-black"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label htmlFor="imdbUrl" className="w-1/4 text-right text-black font-medium">Lien IMDb</label>
                        <input
                            type="text"
                            id="imdbUrl"
                            placeholder="URL IMDb"
                            value={imdbUrl}
                            onChange={(e) => setImdbUrl(e.target.value)}
                            className="w-3/4 p-2 rounded border border-gray-400 text-black"
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                        >
                            Ajouter le film
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        ⬅ Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    );


}

export default Admin