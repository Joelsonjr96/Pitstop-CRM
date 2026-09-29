import React from 'react';
import { Button } from './button';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
      <div className="rounded-full bg-primary/10 p-4">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>
            <Plus className="mr-2 h-4 w-4" /> {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
