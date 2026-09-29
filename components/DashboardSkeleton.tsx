import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 h-full">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
