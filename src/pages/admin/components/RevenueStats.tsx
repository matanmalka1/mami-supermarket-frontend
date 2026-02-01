import React from "react";
import Grid from "@/components/ui/Grid";
import StatCard from "@/components/ui/StatCard";
import { StatItem } from "./types";

const RevenueStats: React.FC<{ stats: StatItem[] }> = ({ stats }) => (
  <Grid cols={4}>
    {stats.map((stat) => (
      <StatCard
        key={stat.label}
        label={stat.label}
        value={stat.value}
        trend={stat.trend}
        sub={stat.sub}
      />
    ))}
  </Grid>
);

export default RevenueStats;
