import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { settingsService } from "../services/settings.service";
import { useAuth } from "../hooks/useAuth";
import { SettingsSkeleton } from "../components/Skeletons";
import type { Organization } from "../types";

const settingsSchema = z.object({
  defaultLowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Threshold must be 0 or more"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsService.getSettings();
        setOrganization(data);
        reset({
          defaultLowStockThreshold: data.defaultLowStockThreshold,
        });
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to fetch settings";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true);
    try {
      const updated = await settingsService.updateSettings({
        defaultLowStockThreshold: data.defaultLowStockThreshold,
      });

      setOrganization(updated);

      // Update user context with new threshold
      if (user) {
        updateUser({
          ...user,
          defaultLowStockThreshold: updated.defaultLowStockThreshold,
        });
      }

      toast.success("Settings updated successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update settings";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="h-8 w-64 bg-surface-container-highest rounded animate-pulse"></div>
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-display">System Settings</h1>
        <p className="text-body text-muted-foreground mt-1">
          Configure global parameters for your inventory control system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-title font-semibold mb-6 flex items-center gap-2">
              <span>⚙</span> Inventory Rules
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-body font-semibold">
                      Default Low Stock Threshold
                    </h3>
                    <p className="text-body-sm text-muted-foreground mt-1">
                      Sets the global quantity level where items are flagged as
                      'Low Stock' unless overridden at the product level.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-lg">
                    <input
                      type="number"
                      placeholder="10"
                      step="1"
                      min="0"
                      className={`w-24 text-center bg-transparent border-none outline-none text-body font-medium ${
                        errors.defaultLowStockThreshold
                          ? "text-destructive"
                          : ""
                      }`}
                      {...register("defaultLowStockThreshold", {
                        setValueAs: (value) =>
                          value === "" || value === undefined
                            ? undefined
                            : Number(value),
                      })}
                    />
                    <span className="label-caps text-muted-foreground">
                      Units
                    </span>
                  </div>
                </div>
                {errors.defaultLowStockThreshold && (
                  <p className="text-destructive text-[11px] mt-2">
                    {errors.defaultLowStockThreshold.message}
                  </p>
                )}
              </div>

              <hr className="border-surface-container-highest" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-semibold">
                    Instant Alert on Low Stock
                  </h3>
                  <p className="text-body-sm text-muted-foreground mt-1">
                    Receive a system notification as soon as an item crosses the
                    threshold.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    disabled
                    defaultChecked
                    className="w-5 h-5 cursor-not-allowed"
                  />
                </div>
              </div>

              <hr className="border-surface-container-highest" />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="px-6 py-2.5 bg-[#1b1b1b] text-white rounded-lg text-body font-medium hover:bg-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Help */}
        <div>
          <div className="card">
            <h3 className="label-caps mb-4 font-semibold">Quick Help</h3>
            <div className="space-y-4">
              <div>
                <p className="text-body-sm font-semibold mb-1">
                  What is Low Stock?
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Items with quantity at or below the threshold are marked as
                  low stock and appear in the dashboard alerts.
                </p>
              </div>
              <hr className="border-surface-container-highest" />
              <div>
                <p className="text-body-sm font-semibold mb-1">
                  Product-Level Override
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Each product can have its own threshold. If not set, it uses
                  this default value.
                </p>
              </div>
              <hr className="border-surface-container-highest" />
              <div>
                <p className="text-body-sm font-semibold mb-1">
                  Recommended Value
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Most StockFlow users set their threshold to 15% of average
                  monthly sales volume.
                </p>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          {organization && (
            <div className="card mt-6">
              <h3 className="label-caps mb-4 font-semibold">
                Organization Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-body-sm text-muted-foreground">Name</p>
                  <p className="text-body font-medium mt-1">
                    {organization.name}
                  </p>
                </div>
                <hr className="border-surface-container-highest" />
                <div>
                  <p className="text-body-sm text-muted-foreground">
                    Organization ID
                  </p>
                  <p className="text-body-sm font-mono break-all">
                    {organization.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
