import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { productService } from "../services/product.service";
import { FormSkeleton } from "../components/Skeletons";
import type { Product } from "../types";

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .min(2, "SKU must be at least 2 characters"),
  description: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity must be a valid number"),
  costPrice: z.number().min(0, "Cost price is required"),
  sellingPrice: z.number().min(0.01, "Selling price must be greater than 0"),
  lowStockThreshold: z.number().int().min(0, "Threshold must be 0 or more").optional().nullable(),
});

type ProductForm = z.infer<typeof productSchema>;

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
        reset({
          name: data.name,
          sku: data.sku,
          description: data.description || "",
          quantity: data.quantity,
          costPrice: data.costPrice,
          sellingPrice: data.sellingPrice,
          lowStockThreshold: data.lowStockThreshold || undefined,
        });
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to load product";
        toast.error(message);
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset, navigate]);

  const costPrice = watch("costPrice");
  const quantity = watch("quantity");
  const sellingPrice = watch("sellingPrice");

  const totalCost = (costPrice || 0) * (quantity || 0);
  const totalValue = (sellingPrice || 0) * (quantity || 0);
  const profitMargin =
    sellingPrice > 0
      ? (((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(1)
      : "0";

  const onSubmit = async (data: ProductForm) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await productService.updateProduct(id, {
        name: data.name,
        sku: data.sku,
        description: data.description || undefined,
        quantity: data.quantity,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        lowStockThreshold: data.lowStockThreshold || undefined,
      });
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update product";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="h-8 w-64 bg-surface-container-highest rounded animate-pulse"></div>
        <FormSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-body text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm text-muted-foreground mb-2">
        <Link to="/products" className="label-caps hover:text-[#1b1b1b]">
          Inventory
        </Link>
        <span>›</span>
        <span className="label-caps text-[#1b1b1b]">Edit Product</span>
      </div>
      <h1 className="text-display mb-6">Product Details</h1>

      {/* Form Card */}
      <div className="card">
        <h2 className="text-title font-semibold mb-1">Core Information</h2>
        <p className="text-body-sm text-muted-foreground mb-6">
          Update the essential tracking data for this stock item.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-body-sm font-medium block mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Premium Wireless Headphones"
                className={`input-field ${errors.name ? "border-destructive" : ""}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-[11px] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-body-sm font-medium block mb-1.5">
                Cost Price (USD) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className={`input-field ${errors.costPrice ? "border-destructive" : ""}`}
                {...register("costPrice", {
                  setValueAs: (value) =>
                    value === "" || value === undefined
                      ? undefined
                      : Number(value),
                })}
              />
              {errors.costPrice && (
                <p className="text-destructive text-[11px] mt-1">
                  {errors.costPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-body-sm font-medium block mb-1.5">
                SKU *
              </label>
              <input
                type="text"
                placeholder="e.g. AUD-WH-900X"
                className={`input-field ${errors.sku ? "border-destructive" : ""}`}
                {...register("sku")}
              />
              {errors.sku && (
                <p className="text-destructive text-[11px] mt-1">
                  {errors.sku.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-body-sm font-medium block mb-1.5">
                Selling Price (USD) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className={`input-field ${errors.sellingPrice ? "border-destructive" : ""}`}
                {...register("sellingPrice", {
                  setValueAs: (value) =>
                    value === "" || value === undefined
                      ? undefined
                      : Number(value),
                })}
              />
              {errors.sellingPrice && (
                <p className="text-destructive text-[11px] mt-1">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-body-sm font-medium block mb-1.5">
                  Quantity on Hand *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  step="1"
                  className={`input-field ${errors.quantity ? "border-destructive" : ""}`}
                  {...register("quantity", {
                    setValueAs: (value) =>
                      value === "" || value === undefined
                        ? undefined
                        : Number(value),
                  })}
                />
                {errors.quantity && (
                  <p className="text-destructive text-[11px] mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-body-sm font-medium block mb-1.5">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  placeholder="10"
                  step="1"
                  className={`input-field ${errors.lowStockThreshold ? "border-destructive" : ""}`}
                  {...register("lowStockThreshold", {
                    setValueAs: (value) =>
                      value === "" || value === undefined
                        ? undefined
                        : Number(value),
                  })}
                />
                {errors.lowStockThreshold && (
                  <p className="text-destructive text-[11px] mt-1">
                    {errors.lowStockThreshold.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <label className="text-body-sm font-medium block mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Optional: Add product details..."
                  rows={2}
                  className="input-field resize-none"
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          <hr className="border-surface-container-highest" />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-low p-4 rounded-lg">
              <p className="text-body-sm text-muted-foreground mb-1">
                Total Cost
              </p>
              <p className="text-title font-semibold">
                ${totalCost.toFixed(2)}
              </p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg">
              <p className="text-body-sm text-muted-foreground mb-1">
                Total Value
              </p>
              <p className="text-title font-semibold">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg">
              <p className="text-body-sm text-muted-foreground mb-1">
                Profit Margin
              </p>
              <p className="text-title font-semibold">{profitMargin}%</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="bg-surface-container-low p-3 rounded-lg">
              <p className="text-body-sm text-muted-foreground mb-1">
                Last Modified
              </p>
              <p className="text-body-sm font-medium">
                {new Date(product.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg">
              <p className="text-body-sm text-muted-foreground mb-1">Created</p>
              <p className="text-body-sm font-medium">
                {new Date(product.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/products"
              className="px-6 py-2.5 border border-surface-container-highest rounded-lg text-body font-medium hover:bg-surface-container-low transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#1b1b1b] text-white rounded-lg text-body font-medium hover:bg-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
