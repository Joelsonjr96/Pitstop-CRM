export function MetricCard({ title, value, description, status, icon: Icon }: { title: string, value: number, description: string, status: 'primary' | 'danger' | 'warning' | 'info' | 'success' | 'muted', icon: any }) {
  const statusColors = {
    primary: 'text-primary',
    danger: 'text-rose-400',
    warning: 'text-amber-400',
    info: 'text-sky-400',
    success: 'text-emerald-400',
    muted: 'text-muted-foreground'
  };

  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-card border border-border">
      <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold tracking-wider">
        {title}
        <Icon className={`h-3 w-3 ${statusColors[status]}`} />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-[10px] text-muted-foreground truncate">{description}</p>
    </div>
  );
}
