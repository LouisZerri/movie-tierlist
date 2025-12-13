import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append('_username', email);
        formData.append('_password', password);

        const res = await Axios.post("/login", formData, { withCredentials: true });

        if (res.data.isAdmin) {
            navigate('/');
        } else {
            setError("Identifiant ou mot de passe incorrect");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion Admin</h1>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Se connecter
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
