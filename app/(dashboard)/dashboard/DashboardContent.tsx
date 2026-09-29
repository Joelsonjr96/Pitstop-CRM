import { AlertCircle, Calendar, Users, CheckCircle2, MessageCircle, Banknote } from "lucide-react";
import ContactStatusBadge from "@/components/ContactStatusBadge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RetentionSummary } from "@/components/dashboard/retention-summary";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { logContact } from "@/app/actions/contacts/log";
import { generateMaintenanceMessage } from "@/lib/whatsapp";

function computeStatus(predictedDate: string, contactStartDate: string | null) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const predicted = new Date(predictedDate);
  predicted.setHours(0, 0, 0, 0);

  const start = contactStartDate ? new Date(contactStartDate) : predicted;
  start.setHours(0, 0, 0, 0);

  if (predicted < now) return "ATRASADO";
  if (start.getTime() === now.getTime()) return "HOJE";
  if (start <= now) return "NA_JANELA";
  return "UPCOMING";
}

export default async function DashboardContent() {
  const supabase = await createClient();

  const { data: predictions } = await supabase
    .from('maintenance_predictions')
    .select(`*, vehicles(plate, model, brand, customers(name, phone, id)), service_types(name)`)
    .in('status', ['UPCOMING', 'CONTACT_WINDOW', 'ATRASADO', 'HOJE', 'NA_JANELA'])
    .order('predicted_date', { ascending: true });

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: returnsThisMonth } = await supabase
    .from('contact_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'APPOINTMENT_SCHEDULED')
    .gte('created_at', startOfMonth.toISOString());

  const { count: totalContactsThisMonth } = await supabase
    .from('contact_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  const retentionRate = (totalCustomers && totalCustomers > 0)
    ? Math.round(((returnsThisMonth || 0) / totalCustomers) * 100)
    : 0;

  const avgTicket = returnsThisMonth && returnsThisMonth > 0 ? 350 : 0;

  const actions = (predictions ?? []).map((p) => {
    const status = computeStatus(p.predicted_date, p.contact_start_date);
    const date = new Date(p.predicted_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...p,
      _status: status,
      _daysDiff: diffDays
    };
  });

  const atrasados = actions.filter((a) => a._status === 'ATRASADO');
  const hoje = actions.filter((a) => a._status === 'HOJE' || a._status === 'NA_JANELA');
  const upcoming = actions.filter((a) => {
    if (a._status !== 'UPCOMING') return false;
    const date = new Date(a.predicted_date);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const upcoming7 = actions.filter((a) => {
    if (a._status !== 'UPCOMING') return false;
    const date = new Date(a.predicted_date);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7 && diffDays <= 30;
  });

  const preventiveWindow = (upcoming7 ?? []).slice(0, 4);
  const pendingActions = [...atrasados, ...hoje];

  // Cálculo de Faturamento em Risco (estimativa baseada em revisões vencidas)
  const revenueAtRisk = atrasados.reduce((sum, a) => {
    // Estimativa: valor médio por serviço atrasado ~ R$ 350
    return sum + 350;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard title="Atrasados" value={atrasados.length} description="Clientes precisam de contato" status="danger" icon={AlertCircle} />
        <MetricCard title="Hoje" value={hoje.length} description="Contatos programados para hoje" status="warning" icon={CheckCircle2} />
        <MetricCard title="Próximos" value={upcoming.length} description="Clientes nos próximos 7 dias" status="info" icon={Calendar} />
        <MetricCard title="Clientes" value={totalCustomers ?? 0} description="Ativos no sistema" status="muted" icon={Users} />
        <MetricCard title="Faturamento em Risco" value={Number(revenueAtRisk) || 0} description="Valor acumulado em revisões vencidas" status="danger" icon={Banknote} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <section className="lg:col-span-7">
          <h2 className="text-lg font-bold text-white mb-4">Clientes para contatar</h2>
          {pendingActions.length > 0 ? (
            <div className="rounded-md border border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Cliente</TableHead>
                    <TableHead className="text-zinc-400">Veículo/Placa</TableHead>
                    <TableHead className="text-zinc-400">Serviço Vencido</TableHead>
                    <TableHead className="text-zinc-400">Status Contato</TableHead>
                    <TableHead className="text-zinc-400">Atraso</TableHead>
                    <TableHead className="text-right text-zinc-400">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingActions.map((action) => (
                    <TableRow key={action.id} className="border-zinc-800">
                      <TableCell className="font-medium">{action.vehicles.customers.name}</TableCell>
                      <TableCell>{action.vehicles.brand} {action.vehicles.model} ({action.vehicles.plate})</TableCell>
                      <TableCell className="text-sm text-zinc-300">{action.service_types?.name ?? 'Revisão'}</TableCell>
                      <TableCell>
                        <ContactStatusBadge
                          predictionId={action.id}
                          customerId={action.vehicles.customers.id}
                        />
                      </TableCell>
                      <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              action._status === 'ATRASADO'
                                ? (Math.abs(action._daysDiff) > 30 ? 'bg-rose-900/30 text-rose-300 border border-rose-700/40' : 'bg-rose-500/10 text-rose-400')
                                : (Math.abs(action._daysDiff) > 15 ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-900/30 text-amber-300')
                          }`}>
                              {Math.abs(action._daysDiff)} dias
                          </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`https://wa.me/${action.vehicles.customers.phone.replace(/\D/g, '')}?text=Olá ${action.vehicles.customers.name.split(' ')[0]}! Aqui é Anderson, da Pitstop. Estou acompanhando o seu ${action.vehicles.brand} ${action.vehicles.model} (${action.vehicles.plate}) e notei que a revisão preventiva está com data vencida. Cuidamos do seu veículo com a mesma seriedade que você dedica a ele. Posso agendar uma avaliação completa, respeitando a rotina do carro e a sua disponibilidade. Quando puder confirmar, organizo a melhor data para você.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border border-zinc-800 border-dashed rounded-lg text-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-foreground font-medium">Nenhum cliente para contatar agora.</p>
            </div>
          )}
        </section>

        <aside className="lg:col-span-3 space-y-6">
          <RetentionSummary
            activeCustomers={totalCustomers ?? 0}
            returnsThisMonth={returnsThisMonth ?? 0}
            totalContacts={totalContactsThisMonth ?? 0}
            retentionRate={retentionRate}
            avgTicket={avgTicket}
          />

          <section className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-foreground">Próximos Vencimentos (15-30 dias)</h3>
            </div>
            {preventiveWindow.length > 0 ? (
              <div className="space-y-2">
                {preventiveWindow.map((item) => (
                  <div key={item.id} className="rounded-md bg-zinc-900/50 border border-zinc-800 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <p className="text-xs font-semibold text-foreground truncate">{item.vehicles.customers.name}</p>
                        <p className="text-[10px] text-zinc-400">{item.vehicles.brand} {item.vehicles.model} • {item.vehicles.plate}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 whitespace-nowrap">
                        {new Date(item.predicted_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-400">{item.service_types?.name ?? 'Revisão'}</span>
                      <a
                        href={`https://wa.me/${item.vehicles.customers.phone.replace(/\D/g, '')}?text=Olá! Seu veículo ${item.vehicles.plate} tem revisão prevista em breve.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2 py-0.5 rounded transition-colors"
                      >
                        Agendar/Contato
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhuma revisão preventiva nos próximos 30 dias.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
