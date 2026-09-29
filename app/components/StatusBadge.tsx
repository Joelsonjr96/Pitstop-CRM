export function StatusBadge({ status, predictedDate }: { status: string; predictedDate: string }) {
  const isOverdue = new Date(predictedDate) < new Date()

  let colorClass = "bg-muted text-muted-foreground"
  let text = status

  if (isOverdue) {
    colorClass = "bg-destructive/10 text-destructive"
    text = "Atrasado"
  } else if (status === 'UPCOMING') {
    colorClass = "bg-primary/10 text-primary"
    text = "Agendado"
  } else if (status === 'CONTACTED') {
    colorClass = "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
    text = "Contatado"
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass} whitespace-nowrap min-w-max`}>
      {text}
    </span>
  )
}
