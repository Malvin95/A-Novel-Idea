import React from "react";
import StatsCard from "./StatsCard";

export default { title: "Molecules/StatsCard", component: StatsCard };

export const Default = () => <StatsCard title="Total Projects" value={42} />;

export const Loading = () => <StatsCard title="Claims" value="…" />;
