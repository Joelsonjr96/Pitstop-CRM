'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { registerFullService } from '@/app/actions/services/register-full'
import { useToast } from '@/components/ui/toaster'
import { KmInput } from '@/components/KmInput'
import { CurrencyInput } from '@/components/CurrencyInput'

export function RegisterServiceDialog({
    vehicle,
    serviceTypes,
    onSuccess
}: {
    vehicle: any,
    serviceTypes: any[],
    onSuccess: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    formData.append('vehicle_id', vehicle.id)
    const result = await registerFullService(prevState, formData)
    if (result?.error) {
      toast({ message: `Erro: ${result.error}`, type: 'error' })
    } else {
      toast({ message: 'Serviço registrado com sucesso!', type: 'success' })
      setIsOpen(false)
      onSuccess()
    }
    return result
  }, null)

  return (
    <>
      <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" /> Nova OS
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Nova OS - ${vehicle.brand} ${vehicle.model} (${vehicle.plate})`}
      >
        <form action={formAction} className="space-y-4">
          <select name="service_type_id" required className="w-full border rounded-md p-2 text-sm bg-background">
            <option value="">Selecione o Serviço</option>
            {serviceTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>

          <KmInput name="odometer" placeholder="KM Atual do Serviço" suffix="km" />
          <CurrencyInput name="amount" placeholder="Valor" />
          <input name="performed_at" type="date" required className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={new Date().toISOString().split('T')[0]} />

          <Button type="submit" className="w-full">Registrar Serviço</Button>
        </form>
      </Dialog>
    </>
  )
}
