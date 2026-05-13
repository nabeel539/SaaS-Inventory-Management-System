/**
 * Skeleton loading components for improved UX during data fetching
 * Uses Tailwind CSS for shimmer animation
 */

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 w-20 bg-surface-container-highest rounded mb-3"></div>
    <div className="h-10 w-32 bg-surface-container-highest rounded"></div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {Array(4)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 6 }) => (
  <tr className="border-b border-surface-container-low">
    {Array(columns)
      .fill(0)
      .map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-surface-container-highest rounded animate-pulse"></div>
        </td>
      ))}
  </tr>
);

export const ProductTableSkeleton = ({ rows = 5 }) => (
  <div className="card p-0 overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-surface-container-highest bg-surface-container-lowest">
          <th className="text-left label-caps px-6 py-4">
            <div className="h-3 w-24 bg-surface-container-highest rounded animate-pulse"></div>
          </th>
          <th className="text-left label-caps px-6 py-4">
            <div className="h-3 w-16 bg-surface-container-highest rounded animate-pulse"></div>
          </th>
          <th className="text-right label-caps px-6 py-4">
            <div className="h-3 w-20 bg-surface-container-highest rounded animate-pulse ml-auto"></div>
          </th>
          <th className="text-right label-caps px-6 py-4">
            <div className="h-3 w-24 bg-surface-container-highest rounded animate-pulse ml-auto"></div>
          </th>
          <th className="text-left label-caps px-6 py-4">
            <div className="h-3 w-16 bg-surface-container-highest rounded animate-pulse"></div>
          </th>
          <th className="text-right label-caps px-6 py-4">
            <div className="h-3 w-12 bg-surface-container-highest rounded animate-pulse ml-auto"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <TableRowSkeleton key={i} columns={6} />
          ))}
      </tbody>
    </table>
  </div>
);

export const FormSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-6 w-40 bg-surface-container-highest rounded mb-2"></div>
    <div className="h-4 w-64 bg-surface-container-highest rounded mb-6"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <div>
        <div className="h-4 w-32 bg-surface-container-highest rounded mb-2"></div>
        <div className="h-10 bg-surface-container-highest rounded"></div>
      </div>
      <div>
        <div className="h-4 w-32 bg-surface-container-highest rounded mb-2"></div>
        <div className="h-10 bg-surface-container-highest rounded"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <div>
        <div className="h-4 w-24 bg-surface-container-highest rounded mb-2"></div>
        <div className="h-10 bg-surface-container-highest rounded"></div>
      </div>
      <div>
        <div className="h-4 w-32 bg-surface-container-highest rounded mb-2"></div>
        <div className="h-10 bg-surface-container-highest rounded"></div>
      </div>
    </div>

    <div className="flex gap-3 pt-4">
      <div className="h-10 w-24 bg-surface-container-highest rounded"></div>
      <div className="h-10 w-32 bg-surface-container-highest rounded"></div>
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="card animate-pulse">
        <div className="h-6 w-40 bg-surface-container-highest rounded mb-6"></div>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <div className="h-4 w-48 bg-surface-container-highest rounded mb-2"></div>
              <div className="h-3 w-64 bg-surface-container-highest rounded"></div>
            </div>
            <div className="h-10 w-32 bg-surface-container-highest rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div className="card animate-pulse">
        <div className="h-4 w-24 bg-surface-container-highest rounded mb-4"></div>
        <div className="space-y-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <div className="h-3 w-32 bg-surface-container-highest rounded mb-2"></div>
                <div className="h-3 w-full bg-surface-container-highest rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
);
