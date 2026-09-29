export function RetentionSummary({
  activeCustomers,
  returnsThisMonth = 0,
  totalContacts = 0,
  retentionRate = 0,
  avgTicket = 0
}: {
  activeCustomers: number,
  returnsThisMonth?: number,
  totalContacts?: number,
  retentionRate?: number,
  avgTicket?: number
}) {
  return (
    <section className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-sm font-semibold text-foreground mb-4">Retenção</h2>
      {activeCustomers > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Clientes ativos", val: activeCustomers.toString() },
              { label: "Retornos este mês", val: returnsThisMonth.toString() },
              { label: "Contatos realizados", val: totalContacts.toString() },
              { label: "Taxa de retorno", val: `${retentionRate}%` },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col ${i < 2 ? 'pb-4 border-b border-zinc-800' : ''} ${i % 2 === 0 ? 'border-r border-zinc-800' : ''} ${i === 3 ? 'col-span-2 pt-2' : ''}`}>
                <p className="text-xl font-bold text-foreground">{stat.val}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-zinc-400 uppercase">Taxa de Retorno</span>
              <span className="text-xs font-bold text-emerald-400">{retentionRate}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all" style={{ width: `${retentionRate}%` }} />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-zinc-400 uppercase">Ticket Médio de Retorno</span>
              <span className="text-sm font-bold text-white">R$ {avgTicket.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Valor médio por contato retornado</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum dado registrado este mês.</p>
      )}
    </section>
  );
}
