import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { BarChart3 } from "lucide-react";
import RevenueHero from "./components/RevenueHero";
import RevenueStats from "./components/RevenueStats";
import RevenueChartSection from "./components/RevenueChartSection";
import { buildAnalyticsMetrics } from "./components/analytics-utils";
import { useManagerAnalytics } from "@/features/admin/hooks/useManagerAnalytics";

const ManagerAnalytics: React.FC = () => {
  const { revenue, status, errorMessage, loadRevenue } = useManagerAnalytics();

  const header = (
    <PageHeader
      title="Business Intelligence"
      subtitle="Revenue Velocity"
      icon={<BarChart3 size={24} />}
    />
  );

  if (status === "loading") {
    return (
      <div className="space-y-10 animate-in fade-in duration-1000">
        {header}
        <LoadingState label="Loading revenue analytics..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-10 animate-in fade-in duration-1000">
        {header}
        <span className="sr-only">Revenue Velocity</span>
        <ErrorState message={errorMessage} onRetry={loadRevenue} />
      </div>
    );
  }

  const metrics = buildAnalyticsMetrics(revenue);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {header}
      <RevenueHero detail={metrics.heroDetail} hasData={metrics.hasData} />
      <RevenueStats stats={metrics.stats} />
      <RevenueChartSection
        entries={metrics.chartEntries}
        hasData={metrics.hasData}
        momentumText={metrics.momentumText}
        momentumWidth={metrics.momentumWidth}
        scopeText={metrics.scopeText}
      />
    </div>
  );
};

export default ManagerAnalytics;
