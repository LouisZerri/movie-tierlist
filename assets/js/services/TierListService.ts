import { TIERLIST_API } from "../config";
import {TierListType} from "../types/tierlist";
import Axios from "axios";

function getTierList(year: number): Promise<TierListType[]> {
    return Axios.get(`${TIERLIST_API}?year=${year}`).then(
        (response) => response.data.member as TierListType[]
    )
}

function addToTierList(year: number, tier: string, movieId: number): Promise<void> {

    return Axios.post(
        TIERLIST_API,
        {
            year: year,
            tier: tier,
            movie: `/api/movies/${movieId}`,
        },
        {
            headers: {
                "Content-Type": "application/ld+json",
            },
        }
    );
}

async function deleteTierListOfYear(year: number): Promise<void> {
    const res = await Axios.get(`${TIERLIST_API}?year=${year}`);
    const entries: TierListType[] = res.data.member as TierListType[];

    await Promise.all(
        entries.map((entry: TierListType) =>
            Axios.delete(`${TIERLIST_API}/${entry.id}`)
        )
    );
}

export default {
    getTierList,
    addToTierList,
    deleteTierListOfYear
}