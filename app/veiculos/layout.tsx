import { DashboardLayoutContent } from "@/app/(dashboard)/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
