import { useState, useEffect } from "react";
import { AlertCircle, Package, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { dashboardService } from "../services/dashboard.service";
import { DashboardStatsSkeleton } from "../components/Skeletons";
import type { DashboardStats } from "../types";

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to fetch dashboard stats";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="mb-6">
          <div className="h-8 w-64 bg-surface-container-highest rounded animate-pulse"></div>
        </div>
        <DashboardStatsSkeleton />
        <div className="card animate-pulse">
          <div className="h-6 w-48 bg-surface-container-highest rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-surface-container-highest rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-body text-muted-foreground">
          Unable to load dashboard
        </p>
      </div>
    );
  }

  const paginatedItems = stats.lowStockItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(stats.lowStockItems.length / itemsPerPage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-display">Welcome back,</h1>
        <p className="text-body text-muted-foreground mt-1">
          Here is what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Total Products</p>
            <Package size={18} className="text-muted-foreground" />
          </div>
          <p className="text-display">{stats.totalProducts}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Total Inventory</p>
            <TrendingUp size={18} className="text-muted-foreground" />
          </div>
          <p className="text-display">{stats.totalInventoryQuantity}</p>
          <p className="text-body-sm text-muted-foreground mt-2">units</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Out of Stock</p>
            <Package size={18} className="text-muted-foreground" />
          </div>
          <p className="text-display text-destructive">
            {stats.outOfStockCount}
          </p>
        </div>

        <div className="card border-l-4 border-l-destructive">
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Low Stock Items</p>
            <AlertCircle size={18} className="text-destructive" />
          </div>
          <p className="text-display text-destructive">{stats.lowStockCount}</p>
        </div>
      </div>

      {/* Valuation Card */}
      <div className="card mb-6">
        <p className="label-caps mb-3">Total Inventory Valuation</p>
        <p className="text-display">
          $
          {stats.totalValuation.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Low Stock Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-title font-semibold mb-1">Low Stock Items</h2>
            <p className="text-body-sm text-muted-foreground">
              Items currently below their defined threshold.
            </p>
          </div>
        </div>

        {stats.lowStockItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-body">All items are well-stocked!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-highest">
                    <th className="text-left label-caps px-4 py-3">
                      Product Name
                    </th>
                    <th className="text-left label-caps px-4 py-3">SKU</th>
                    <th className="text-right label-caps px-4 py-3">
                      Quantity
                    </th>
                    <th className="text-right label-caps px-4 py-3">
                      Threshold
                    </th>
                    <th className="text-left label-caps px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-surface-container-low hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-4 py-3 text-body font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-muted-foreground">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-right text-body font-medium">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-body">
                        {item.threshold}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-[11px] font-semibold label-caps ${
                            item.status === "OUT_OF_STOCK"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status === "OUT_OF_STOCK"
                            ? "Out of Stock"
                            : "Low Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-container-highest">
                <p className="text-body-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    stats.lowStockItems.length,
                  )}{" "}
                  of {stats.lowStockItems.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-surface-container-highest rounded text-body-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded text-body-sm transition-colors ${
                          currentPage === page
                            ? "bg-[#1b1b1b] text-white"
                            : "border border-surface-container-highest hover:bg-surface-container-low"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-surface-container-highest rounded text-body-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
