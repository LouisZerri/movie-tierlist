import { TIERLIST_API } from "../config";
import {TierListType} from "../types/tierlist";
import Axios from "axios";

function getTierList(year: number): Promise<TierListType[]> {
    return Axios.get(`${TIERLIST_API}?year=${year}`).then(
        (response) => response.data.member as TierListType[]
    )
}

async function addToTierList(year: number, tier: string, movieId: number, position: number = 0): Promise<{ id: number } | undefined> {
    const res = await Axios.post(
        TIERLIST_API,
        {
            year: year,
            tier: tier,
            movie: `/api/movies/${movieId}`,
            position: position,
        },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/ld+json",
            },
        }
    );
    return { id: res.data.id };
}

async function deleteTierListOfYear(year: number): Promise<void> {
    const res = await Axios.get(`${TIERLIST_API}?year=${year}`, { withCredentials: true });
    const entries: TierListType[] = res.data.member as TierListType[];

    await Promise.all(
        entries.map((entry: TierListType) =>
            Axios.delete(`${TIERLIST_API}/${entry.id}`, { withCredentials: true })
        )
    );
}

function updateTierPosition(tierListId: number, newTier: string, position: number): Promise<void> {
    return Axios.patch(
        `${TIERLIST_API}/${tierListId}`,
        { tier: newTier, position: position },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/merge-patch+json",
            },
        }
    );
}

function updateTier(tierListId: number, newTier: string): Promise<void> {
    return Axios.patch(
        `${TIERLIST_API}/${tierListId}`,
        { tier: newTier },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/merge-patch+json",
            },
        }
    );
}

export default {
    getTierList,
    addToTierList,
    deleteTierListOfYear,
    updateTier,
    updateTierPosition,
}