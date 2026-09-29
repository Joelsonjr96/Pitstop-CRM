'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export function DeleteCustomerDialog({ customerId, action }: { customerId: string, action: (formData: FormData) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" /> Excluir
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar exclusão"
      >
        <p className="mb-6 text-sm text-muted-foreground">
          Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <form action={action}>
            <input type="hidden" name="id" value={customerId} />
            <Button type="submit" variant="destructive">Excluir</Button>
          </form>
        </div>
      </Dialog>
    </>
  )
}
