'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { AddVehicleForm } from '@/components/AddVehicleForm'
import { Plus } from 'lucide-react'

export function AddVehicleDialog({ customerId }: { customerId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="default" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Adicionar Veículo
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adicionar Novo Veículo"
      >
        <AddVehicleForm customerId={customerId} onSuccess={() => setIsOpen(false)} />
      </Dialog>
    </>
  )
}
