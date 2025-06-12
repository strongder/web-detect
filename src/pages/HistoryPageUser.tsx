"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GraphVisualization from "@/components/GraphVisualization";
import { URL } from "@/api";
import api from "@/api";

export default function HistoryPageUser() {
  const [history, setHistory] = useState<any>([]);
  const [filteredHistory, setFilteredHistory] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGraph, setShowGraph] = useState(false);
  const [currentGraphUrl, setCurrentGraphUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of items per page
  const { toast } = useToast();

  const fetchHistory = async () => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    setIsLoading(true);
    try {
      const response = await api.get(`/predict/history/${userId}`);
      const data = await response.data;
      if (data.code === "200") {
        setHistory(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Failed to load history",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while loading history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and search effect
  useEffect(() => {
    let filtered = history;
    if (search) {
      filtered = filtered.filter(
        (item: any) =>
          (item.file_name &&
            item.file_name.toLowerCase().includes(search.toLowerCase())) ||
          (item.username &&
            item.username.toLowerCase().includes(search.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (resultFilter) {
      filtered = filtered.filter((item: any) => item.result === resultFilter);
    }
    setFilteredHistory(filtered);
    setPage(1); // Reset to first page on filter/search change
  }, [search, resultFilter, history]);

  const handleViewGraph = (imageUrl: any) => {
    setCurrentGraphUrl(`${URL}${imageUrl}`);
    setShowGraph(true);
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      return timestamp.split(" ")[0];
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return timestamp.split(" ")[1];
    }
  };

  // Pagination logic
  const totalPage = Math.ceil(filteredHistory.length / pageSize);
  const paginatedData = filteredHistory.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mx-auto text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Scan History</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-[#1e293b] text-gray-400 hover:text-white"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by file, username, email..."
          className="px-3 py-2 rounded bg-[#1e293b] border border-[#2e3b52] text-white text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <select
          className="px-3 py-2 rounded bg-[#1e293b] border border-[#2e3b52] text-white text-sm"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="">All Results</option>
          <option value="An toàn">An toàn</option>
          <option value="Mã độc">Mã độc</option>
        </select>
      </div>

      {isLoading && history.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 mr-2 animate-spin text-[#2563eb]" />
          <span>Loading history...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-[#1e293b] bg-[#0f172a]">
          <p className="text-gray-400">No scan history found</p>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg border-[#1e293b] bg-[#0f172a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  File Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Result
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item: any) => (
                <tr key={item.id} className="border-b border-[#1e293b]">
                  <td className="px-4 py-3 text-sm">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatTime(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.username || "-"}</td>
                  <td className="px-4 py-3 text-sm">{item.email || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span title={item.file_name} className="cursor-pointer">
                      {item.file_name && item.file_name.length > 30
                        ? item.file_name.slice(0, 27) + "..."
                        : item.file_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.result === "An toàn"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
                      {item.result}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.image_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                        onClick={() => handleViewGraph(item.image_url)}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 3v3.5m8-3v3.5M3 8h18m-18 3.5v7A1.5 1.5 0 0 0 4.5 20h15a1.5 1.5 0 0 0 1.5-1.5v-7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        View Graph
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No graph available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-t border-[#1e293b]">
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 rounded bg-[#1e293b] text-white border border-[#2e3b52] disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} / {totalPage || 1}
              </span>
              <button
                className="px-2 py-1 rounded bg-[#1e293b] text-white border border-[#2e3b52] disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page === totalPage || totalPage === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showGraph && currentGraphUrl && (
        <div className="mt-8">
          <GraphVisualization imageUrl={currentGraphUrl} />
        </div>
      )}
    </div>
  );
}
