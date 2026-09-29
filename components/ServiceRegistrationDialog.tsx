'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { registerService } from '@/app/actions/services/register'
import { KmInput } from './KmInput'

export function ServiceRegistrationDialog({ vehicleId, serviceTypes }: { vehicleId: string, serviceTypes: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-1" /> Nova OS
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nova Ordem de Serviço">
        <form action={async (formData) => {
          await registerService(formData)
          setIsOpen(false)
        }} className="space-y-4">
          <input type="hidden" name="vehicle_id" value={vehicleId} />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Serviços Realizados</label>
            <select name="service_type_id" required className="w-full border rounded-md p-2 text-sm bg-background">
              {serviceTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Data do Serviço</label>
              <input name="performed_at" type="date" required className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Quilometragem Atual</label>
                <KmInput name="odometer" placeholder="KM Atual" />
            </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Observações</label>
              <textarea name="notes" className="w-full border rounded-md p-2 text-sm bg-background min-h-[80px]" />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Próxima Data (Opcional)</label>
              <input name="next_service_date" type="date" className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Próxima KM (Opcional)</label>
                <KmInput name="next_service_odometer" placeholder="Próxima KM" />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">Salvar Ordem de Serviço</Button>
        </form>
      </Dialog>
    </>
  )
}
