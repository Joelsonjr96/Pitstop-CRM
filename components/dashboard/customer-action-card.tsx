import { ActionMenu } from "@/components/ActionMenu";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { logContact } from "@/app/actions/contacts/log";
import { generateMaintenanceMessage } from "@/lib/whatsapp";

export function CustomerActionCard({ action }: { action: any }) {
  const getStatusInfo = () => {
    const diff = action._daysDiff;
    if (action._status === 'ATRASADO') {
      return {
        text: `Atrasado há ${Math.abs(diff)} dias`,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: '🔴'
      };
    }
    if (action._status === 'HOJE' || action._status === 'NA_JANELA') {
      return {
        text: 'Contato hoje',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: '🟡'
      };
    }
    return {
      text: `Próximo contato em ${diff} dias`,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      icon: '🔵'
    };
  };

  const status = getStatusInfo();

  const handleSendReminder = async () => {
    const url = generateMaintenanceMessage(
      action.vehicles.customers.name,
      action.vehicles.customers.phone,
      `${action.vehicles.brand} ${action.vehicles.model}`,
      action.vehicles.plate,
      action.service_types?.name || 'Serviço',
      new Date(action.predicted_date).toLocaleDateString('pt-BR')
    );

    // Registrar contato
    const formData = new FormData();
    formData.append('customer_id', action.vehicles.customers.id);
    formData.append('maintenance_prediction_id', action.id);
    formData.append('action', 'Lembrete de manutenção enviado');
    await logContact(formData);

    window.open(url, '_blank');
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground text-base">{action.vehicles.customers.name}</h3>
            <p className="text-sm text-muted-foreground">
                {action.vehicles.brand} {action.vehicles.model} · {action.vehicles.plate}
            </p>
        </div>

        <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                <span>{status.icon}</span>
                <span>{status.text}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-600" onClick={handleSendReminder}>
                <MessageCircle className="h-4 w-4" />
            </Button>
            <ActionMenu />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-4">
        <div>
            <p className="text-[10px] uppercase text-muted-foreground">Serviço</p>
            <p className="text-sm font-medium text-primary">{action.service_types?.name}</p>
        </div>
        <div className="text-right">
            <p className="text-[10px] uppercase text-muted-foreground">Último serviço</p>
            <p className="text-sm font-medium text-foreground">--/--/----</p>
        </div>
        <div className="text-right">
            <p className="text-[10px] uppercase text-muted-foreground">Data prevista</p>
            <p className="text-sm font-medium text-foreground">{new Date(action.predicted_date).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
