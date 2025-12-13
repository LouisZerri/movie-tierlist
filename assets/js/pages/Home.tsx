import React from "react";
import Movies from "../components/Movies";

const Home: React.FC = () => (
    <div className="mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-white">Ma Tier list de films</h1>
        <p className="custom-gray">Liste totalement subjective basée sur mes goûts</p>
        <Movies />
    </div>
)

export default Home;