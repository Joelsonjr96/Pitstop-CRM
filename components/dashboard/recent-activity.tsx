import Link from 'next/link';

export function RecentActivity({ activities = [] }: { activities?: { text: string; time: string; href: string }[] }) {
  return (
    <section className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-sm font-semibold text-foreground mb-4">Atividade recente</h2>
      {activities.length > 0 ? (
        <>
          <div className="space-y-4">
            {activities.map((act, i) => (
              <Link key={i} href={act.href} className="flex gap-3 group">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">{act.text}</p>
                  <p className="text-xs text-muted-foreground">{act.time}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <Link href="/atividades" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Ver todas →
            </Link>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
      )}
    </section>
  );
}
