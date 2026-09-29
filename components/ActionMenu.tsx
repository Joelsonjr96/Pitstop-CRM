'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toaster';

export function ActionMenu() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleMarkAsContacted = () => {
    toast({ message: "Cliente marcado como contatado.", type: "success" })
  }

  const handleConfirmPostpone = () => {
    toast({ message: "Contato adiado.", type: "success" })
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground transition-colors duration-150 hover:text-foreground hover:bg-accent">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Ver cliente</DropdownMenuItem>
          <DropdownMenuItem>Ver veículo</DropdownMenuItem>
          <DropdownMenuItem>Ver histórico</DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Adiar contato
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMarkAsContacted} className="cursor-pointer">
            Marcar como contatado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Adiar contato?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Esta ação moverá o contato para uma data futura. Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmPostpone}>Confirmar</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
