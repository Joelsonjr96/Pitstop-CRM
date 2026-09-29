'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { KmInput } from '@/components/KmInput'
import { Plus, Loader2 } from 'lucide-react'
import { createVehicle } from '@/app/actions/vehicles/create'
import { useToast } from '@/components/ui/toaster'

export function AddVehicleForm({ customerId, onSuccess }: { customerId: string, onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transmission, setTransmission] = useState('Manual')

  const handleSubmit = async (formData: FormData) => {
    if (transmission === 'Manual') {
        formData.set('transmission_oil_type', '')
    }
    setIsSubmitting(true)
    const result = await createVehicle(formData)
    setIsSubmitting(false)

    if (result.error) {
        toast({ message: `Erro: ${result.error}`, type: 'error' })
    } else {
        toast({ message: 'Veículo cadastrado com sucesso!', type: 'success' })
        formRef.current?.reset()
        onSuccess()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="hidden" name="customer_id" value={customerId} />

        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Placa</label>
            <input
                name="plate"
                placeholder="Placa (Ex: ABC-1234)"
                required
                className="w-full bg-background border border-border rounded-md p-2 text-sm"
            />
        </div>

        <KmInput name="current_km" placeholder="KM Atual (Ex: 50.000)" />

        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Marca</label>
            <input name="brand" placeholder="Marca" required className="w-full bg-background border border-border rounded-md p-2 text-sm" />
        </div>

        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Modelo</label>
            <input name="model" placeholder="Modelo" required className="w-full bg-background border border-border rounded-md p-2 text-sm" />
        </div>

        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Ano</label>
            <input name="year" type="number" placeholder="Ano" required className="w-full bg-background border border-border rounded-md p-2 text-sm" />
        </div>

        <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Transmissão</label>
            <select name="transmission_type" value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full bg-background border border-border rounded-md p-2 text-sm">
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
            </select>
        </div>

        <input name="oil_type" placeholder="Óleo Motor (Ex: 5W30)" className="bg-background border border-border rounded-md p-2 text-sm" />

        {transmission === 'Automático' && (
            <input name="transmission_oil_type" placeholder="Óleo Câmbio (Ex: ATF)" className="bg-background border border-border rounded-md p-2 text-sm" />
        )}

        <Button type="submit" className="md:col-span-2 w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        Cadastrar Veículo
        </Button>
    </form>
  )
}
