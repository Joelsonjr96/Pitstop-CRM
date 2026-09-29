import { MessageCircle, Calendar, AlertCircle } from "lucide-react";

interface NextActionBadgeProps {
  customerName: string;
  description: string;
  type: 'whatsapp' | 'schedule' | 'default';
}

export function NextActionBadge({ customerName, description, type }: NextActionBadgeProps) {
  const Icon = type === 'whatsapp' ? MessageCircle : type === 'schedule' ? Calendar : AlertCircle;

  const styles = type === 'whatsapp'
    ? "bg-success/10 border-success/20 text-success"
    : type === 'schedule'
    ? "bg-primary/10 border-primary/20 text-primary"
    : "bg-muted border-border text-muted-foreground";

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${styles}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">
        <span className="font-bold">{customerName}</span> → {description}
      </span>
    </div>
  );
}
