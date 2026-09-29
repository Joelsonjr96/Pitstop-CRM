'use client'
import { usePathname } from "next/navigation";
import { useBranding } from "@/components/providers/branding-provider";

export function Header() {
  const pathname = usePathname();
  const brand = useBranding();
  const isDashboard = pathname.includes('/dashboard') || pathname === '/';

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getPageTitle = () => {
    if (isDashboard) return 'Bom dia, Anderson';
    if (pathname.includes('/clientes')) return 'Clientes';
    if (pathname.includes('/veiculos')) return 'Veículos';
    if (pathname.includes('/servicos')) return 'Serviços';
    if (pathname.includes('/configuracoes')) return 'Configurações';
    return 'Painel';
  }

  return (
    <header className="h-20 bg-background flex items-center px-8 justify-between border-b border-border">
      <div className="flex flex-col justify-center">
        <h2 className="font-bold text-2xl tracking-tight text-foreground">
          {isDashboard ? (
            <div className="flex items-center gap-4">
                <span>{getPageTitle()}</span>
                <span className="text-sm font-medium text-muted-foreground capitalize font-normal">
                    {getFormattedDate()}
                </span>
            </div>
          ) : getPageTitle()}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isDashboard
            ? "Veja quais clientes precisam da sua atenção hoje."
            : getPageTitle() === 'Clientes' ? "Gerencie os clientes cadastrados." : getPageTitle() === 'Serviços' ? "Configure tipos de manutenção." : `${brand.name}`
          }
        </p>
      </div>

      {!isDashboard && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {brand.name}
          </p>
        </div>
      )}
    </header>
  );
}
