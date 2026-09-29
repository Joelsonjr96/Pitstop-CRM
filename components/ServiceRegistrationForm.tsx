'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { registerService } from '@/app/actions/services/register'
import { Plus } from 'lucide-react'

export function ServiceRegistrationForm({ vehicleId, serviceTypes }: { vehicleId: string, serviceTypes: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full h-12 text-base">
        <Plus className="mr-2 h-5 w-5" /> Registrar Serviço
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Registrar Serviço">
        <form action={async (formData) => {
          await registerService(formData)
          setIsOpen(false)
        }} className="space-y-4">
          <input type="hidden" name="vehicle_id" value={vehicleId} />

          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de Serviço</label>
            <select name="service_type_id" required className="w-full border rounded-md p-2 text-sm">
              {serviceTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">KM</label>
              <input name="odometer" type="number" required className="w-full border rounded-md p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Data</label>
              <input name="performed_at" type="date" required className="w-full border rounded-md p-2 text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Notas</label>
            <textarea name="notes" className="w-full border rounded-md p-2 text-sm" />
          </div>

          <Button type="submit" className="w-full">Salvar Serviço</Button>
        </form>
      </Dialog>
    </>
  )
}
