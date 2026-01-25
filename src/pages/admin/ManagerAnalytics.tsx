import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { BarChart3 } from "lucide-react";
import { apiService } from "@/services/api";
import RevenueHero from "./components/RevenueHero";
import RevenueStats from "./components/RevenueStats";
import RevenueChartSection from "./components/RevenueChartSection";
import { buildAnalyticsMetrics, RevenueData } from "./components/analytics-utils";

const ManagerAnalytics: React.FC = () => {
  const [revenue, setRevenue] = useState<RevenueData>({ labels: [], values: [] });
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadRevenue = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await apiService.admin.getRevenueAnalytics();
      const payload = response?.data ?? response;
      if (payload && Array.isArray(payload.labels) && Array.isArray(payload.values)) {
        setRevenue({ labels: payload.labels, values: payload.values });
      } else {
        setRevenue({ labels: [], values: [] });
      }
      setStatus("idle");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load analytics");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  const header = (
    <PageHeader
      title="Business Intelligence"
      subtitle="Revenue overview"
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
