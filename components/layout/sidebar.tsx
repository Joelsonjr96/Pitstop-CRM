'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/logo';
import { useBranding } from '@/components/providers/branding-provider';
import { navigation } from '@/config/navigation';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';

export function Sidebar() {
  const pathname = usePathname();
  const brand = useBranding();

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 min-h-screen border-r border-border bg-card text-foreground flex-col p-4 transition-all duration-300">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2 overflow-hidden">
            <Logo name={brand.name} logo={brand.logo} />
            <span className="text-lg font-bold text-foreground truncate hidden lg:block">{brand.name}</span>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-8">
          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 mb-2 text-[10px] font-bold text-muted-foreground tracking-wider hidden lg:block uppercase">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={item.name}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-2 ${
                        isActive
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="hidden lg:block">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-border overflow-hidden space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground border border-border flex-shrink-0">
                        A
                    </div>
                    <div className="flex flex-col overflow-hidden hidden lg:flex">
                        <span className="text-sm font-bold text-foreground truncate">Anderson</span>
                        <span className="text-xs text-muted-foreground">Administrador</span>
                    </div>
                </div>
                <form action={logout}>
                    <Button variant="ghost" size="icon" type="submit" title="Sair">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    </aside>
  );
}
