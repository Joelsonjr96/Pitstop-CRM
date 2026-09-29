'use client'

import { useState, useEffect, useActionState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createServiceRecord, ActionState } from '@/app/actions/service-records/create'
import { Button } from '@/components/ui/button'

export default function RegisterServicePage() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [serviceTypes, setServiceTypes] = useState<any[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [state, formAction] = useActionState<ActionState, FormData>(createServiceRecord, { error: null } as ActionState)

  useEffect(() => {
    async function fetchData() {
      const { data: custData } = await supabase.from('customers').select('id, name')
      const { data: servData } = await supabase.from('service_types').select('id, name')
      setCustomers(custData || [])
      setServiceTypes(servData || [])
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchVehicles() {
      if (!selectedCustomerId) {
        setVehicles([])
        return
      }
      const { data } = await supabase
        .from('vehicles')
        .select('id, brand, model, plate')
        .eq('customer_id', selectedCustomerId)
      setVehicles(data || [])
    }
    fetchVehicles()
  }, [selectedCustomerId])

  return (
    <div className="h-full space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Registrar Serviço</h1>

      <div className="bg-card border border-border rounded-2xl p-6 max-w-lg">
        <form action={formAction} className="space-y-4">
          <div className="flex flex-col gap-4">
            <select
              name="customer_id"
              required
              className="bg-background border border-border rounded-md p-2 text-sm text-foreground"
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Selecione o Cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select name="vehicle_id" required className="bg-background border border-border rounded-md p-2 text-sm text-foreground">
              <option value="">{vehicles.length ? 'Selecione o Veículo' : 'Selecione um cliente primeiro'}</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
              ))}
            </select>

            <select name="service_type_id" required className="bg-background border border-border rounded-md p-2 text-sm text-foreground">
              <option value="">Selecione o Serviço</option>
              {serviceTypes.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>

            <input name="odometer" type="number" placeholder="KM Atual" required className="bg-background border border-border rounded-md p-2 text-sm text-foreground" />
            <input name="value" type="number" step="0.01" placeholder="Valor" className="bg-background border border-border rounded-md p-2 text-sm text-foreground" />
            <textarea name="notes" placeholder="Notas" className="bg-background border border-border rounded-md p-2 text-sm text-foreground h-24" />
          </div>
          <Button type="submit" className="w-full">
            Registrar Serviço
          </Button>
        </form>
      </div>
    </div>
  )
}
