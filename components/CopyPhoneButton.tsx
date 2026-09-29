'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CopyPhoneButton({ phone }: { phone: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      title="Copiar telefone"
      onClick={() => navigator.clipboard.writeText(phone)}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
