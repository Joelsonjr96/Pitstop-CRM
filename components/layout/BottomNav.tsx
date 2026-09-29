'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, Wrench, ClipboardList } from 'lucide-react';

const items = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Veículos', href: '/veiculos', icon: Car },
    { name: 'Serviços', href: '/servicos', icon: Wrench },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-md text-[10px] ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={20} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
