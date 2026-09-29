'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'
import { updateVehicle } from '@/app/actions/vehicles/update'
import { KmInput } from './KmInput'

export function VehicleEditDialog({ vehicle }: { vehicle: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [transmission, setTransmission] = useState(vehicle.transmission_type || 'Manual')

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4 mr-2" /> Editar
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Editar ${vehicle.brand} ${vehicle.model}`}
      >
        <form action={async (formData) => {
          if (transmission === 'Manual') {
            formData.set('transmission_oil_type', '')
          }
          await updateVehicle(formData);
          setIsOpen(false);
        }} className="space-y-4">
          <input type="hidden" name="vehicle_id" value={vehicle.id} />
          <input type="hidden" name="customer_id" value={vehicle.customer_id} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Marca</label>
                <input name="brand" defaultValue={vehicle.brand} required className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Modelo</label>
                <input name="model" defaultValue={vehicle.model} required className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Placa</label>
                <input name="plate" defaultValue={vehicle.plate} required className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Ano</label>
                <input name="year" type="number" defaultValue={vehicle.year} required className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
          </div>

          <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">KM Atual</label>
                <KmInput name="current_km" defaultValue={vehicle.current_km} placeholder="KM Atual" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Óleo Motor</label>
                <input name="oil_type" defaultValue={vehicle.oil_type} className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Transmissão</label>
                <select name="transmission_type" value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-background">
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                </select>
            </div>
          </div>

          {transmission === 'Automático' && (
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Óleo Câmbio</label>
                <input name="transmission_oil_type" defaultValue={vehicle.transmission_oil_type} className="w-full border rounded-md p-2 text-sm bg-background" />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
