import React, { useEffect, useState, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { stockRequestsService } from "@/domains/stock-requests/service";
import type {
  StockRequest,
  StockRequestStatus,
} from "@/domains/stock-requests/types";
import { StatusFilter } from "./components/StatusFilter";
import { StockRequestCard } from "./components/StockRequestCard";

const ITEMS_PER_PAGE = 10;

const StockRequestHistory: React.FC = () => {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StockRequestStatus | "all">(
    "all",
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await stockRequestsService.getMy();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch stock requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((req) => req.status === statusFilter);
  }, [requests, statusFilter]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const handleFilterChange = (status: StockRequestStatus | "all") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingState label="Loading your requests..." />;
  }

  return (
    <div className="space-y-6">
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />

      {paginatedRequests.length === 0 ? (
        <EmptyState
          title="No stock requests found"
          description={
            statusFilter !== "all"
              ? `No ${statusFilter} requests`
              : "Submit your first stock request"
          }
        />
      ) : (
        <div className="space-y-4">
          {paginatedRequests.map((request) => (
            <StockRequestCard key={request.id} {...request} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default StockRequestHistory;
