import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../services/product.service";
import { useDebounce } from "../hooks/useDebounce";
import { ProductTableSkeleton } from "../components/Skeletons";
import type { Product, PaginationInfo } from "../types";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = async (page: number, searchTerm: string) => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts({
        search: searchTerm || undefined,
        page,
        limit: 10,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch products";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad) return;
    fetchProducts(1, debouncedSearch);
  }, [debouncedSearch, isInitialLoad]);

  useEffect(() => {
    fetchProducts(1, "");
    setIsInitialLoad(false);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts(pagination.page, search);
      setDeleteConfirm(null);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete product";
      toast.error(message);
    }
  };

  const getStatusBadge = (product: Product) => {
    if (product.quantity === 0) {
      return (
        <span className="inline-block px-2 py-1 bg-destructive/10 text-destructive rounded text-[11px] font-semibold label-caps">
          Out of Stock
        </span>
      );
    }
    const threshold = product.lowStockThreshold ?? 10;
    if (product.quantity <= threshold) {
      return (
        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-[11px] font-semibold label-caps">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-[11px] font-semibold label-caps">
        In Stock
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-display">Products</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage and monitor your warehouse stock levels
          </p>
        </div>
        <Link
          to="/products/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11 w-full"
        />
      </div>

      {/* Products Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <ProductTableSkeleton rows={5} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-body">
              No products found.{" "}
              {search
                ? "Try a different search."
                : "Add your first product to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-container-highest bg-surface-container-lowest">
                    <th className="text-left label-caps px-6 py-4">
                      Product Name
                    </th>
                    <th className="text-left label-caps px-6 py-4">SKU</th>
                    <th className="text-right label-caps px-6 py-4">
                      Quantity
                    </th>
                    <th className="text-right label-caps px-6 py-4">
                      Selling Price
                    </th>
                    <th className="text-left label-caps px-6 py-4">Status</th>
                    <th className="text-right label-caps px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-surface-container-low hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4 text-body font-medium">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-body-sm text-muted-foreground">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-right text-body">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-body font-medium">
                        ${product.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(product)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${product.id}/edit`}
                            className="p-2 hover:bg-surface-container-highest rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} className="text-muted-foreground" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 hover:bg-destructive/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container-highest">
                <p className="text-body-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchProducts(pagination.page - 1, search)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-surface-container-highest rounded text-body-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                  >
                    ← Previous
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = pagination.page - 2 + i;
                      if (page > 0 && page <= pagination.totalPages)
                        return page;
                      return null;
                    },
                  )
                    .filter(Boolean)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchProducts(page as number, search)}
                        className={`px-3 py-1 rounded text-body-sm transition-colors ${
                          pagination.page === page
                            ? "bg-[#1b1b1b] text-white"
                            : "border border-surface-container-highest hover:bg-surface-container-low"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  <button
                    onClick={() => fetchProducts(pagination.page + 1, search)}
                    disabled={pagination.page === pagination.totalPages}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 mx-auto mb-4">
              <Trash2 size={20} className="text-destructive" />
            </div>
            <h3 className="text-title font-semibold text-center mb-2">
              Delete Product?
            </h3>
            <p className="text-body-sm text-muted-foreground text-center mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-surface-container-highest rounded-lg text-body-sm hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-white rounded-lg text-body-sm hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
