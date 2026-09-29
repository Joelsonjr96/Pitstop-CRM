import { Suspense } from "react";
import DashboardContent from "./DashboardContent";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
