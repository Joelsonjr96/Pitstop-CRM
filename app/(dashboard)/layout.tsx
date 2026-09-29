import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}

export function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto pb-16 md:pb-0">
            <div className="w-full max-w-[1440px] mx-auto">
                <Header />
                <main className="p-4 md:p-8 flex-1">{children}</main>
            </div>
        </div>
        <BottomNav />
    </div>
  );
}
