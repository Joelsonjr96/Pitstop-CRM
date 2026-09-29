import { LayoutDashboard, Users, Car, Wrench, ClipboardList } from 'lucide-react';

export const navigation = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Serviços', href: '/servicos', icon: Wrench },
    ],
  },
];
