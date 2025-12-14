import React from "react";
import { Tier } from "../../types/tier";
import TierRowAdmin from "./TierRowAdmin";
import TierRowStatic from "./TierRowStatic";

type Props = {
    tiers: Tier[];
    isAdmin: boolean;
};

const TierList: React.FC<Props> = ({ tiers, isAdmin }) => {
    return (
        <div className="space-y-2">
            {tiers.map(tier => (
                isAdmin ? (
                    <TierRowAdmin key={tier.letter} tier={tier} />
                ) : (
                    <TierRowStatic key={tier.letter} tier={tier} />
                )
            ))}
        </div>
    );
};

export default TierList;