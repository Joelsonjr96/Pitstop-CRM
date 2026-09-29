'use client'

import { useState, useActionState } from 'react'
import { searchCustomers } from '@/domain/customers/queries'
import { Button } from '@/components/ui/button'
import { registerFullService } from '@/app/actions/services/register-full'

export function ServiceRegistrationForm({ serviceTypes }: { serviceTypes: any[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [showNewClient, setShowNewClient] = useState(false)
  const [state, formAction, isPending] = useActionState(registerFullService, null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const customers = await searchCustomers(query)
    setResults(customers)
    setShowNewClient(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nome ou telefone do cliente..." className="border p-2 rounded w-full" />
          <Button type="submit">Buscar</Button>
        </form>
        <Button variant="outline" onClick={() => { setResults([]); setShowNewClient(true); setSelectedVehicle(null); }}>Novo Cliente</Button>
      </div>

      {results.length > 0 && !showNewClient && (
        <div className="space-y-4">
          <h2 className="font-semibold">Clientes Encontrados</h2>
          {results.map(c => (
            <div key={c.id} className="border p-4 rounded">
              <p className="font-bold">{c.name} ({c.phone})</p>
              <div className="flex gap-2 mt-2">
                {c.vehicles.map((v: any) => (
                  <Button key={v.id} onClick={() => setSelectedVehicle({ ...v, customer_name: c.name })}>{v.brand} {v.model} ({v.plate})</Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(selectedVehicle || showNewClient) && (
        <form action={formAction} className="border p-6 rounded-xl space-y-4 max-w-lg">
          <h2 className="font-bold text-lg">{selectedVehicle ? `Registrar para ${selectedVehicle.customer_name} - ${selectedVehicle.model}` : "Novo Cliente e Veículo"}</h2>

          {showNewClient && (
            <>
              <input name="customer_name" placeholder="Nome do Cliente" required className="border p-2 rounded w-full" />
              <input name="customer_phone" placeholder="Telefone" required className="border p-2 rounded w-full" />
              <input name="plate" placeholder="Placa" required className="border p-2 rounded w-full" />
              <input name="brand" placeholder="Marca" required className="border p-2 rounded w-full" />
              <input name="model" placeholder="Modelo" required className="border p-2 rounded w-full" />
              <input name="year" type="number" placeholder="Ano" required className="border p-2 rounded w-full" />
              <input name="current_km" placeholder="KM Atual" required className="border p-2 rounded w-full" />
            </>
          )}

          {selectedVehicle && <input type="hidden" name="vehicle_id" value={selectedVehicle.id} />}

          <select name="service_type_id" required className="border p-2 rounded w-full">
            <option value="">Selecione o Serviço</option>
            {serviceTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>

          <input name="odometer" type="number" placeholder="KM Atual do Serviço" required className="border p-2 rounded w-full" />
          <input name="performed_at" type="date" required className="border p-2 rounded w-full" defaultValue={new Date().toISOString().split('T')[0]} />

          <Button type="submit" className="w-full">Concluir Registro</Button>
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        </form>
      )}
    </div>
  )
}
