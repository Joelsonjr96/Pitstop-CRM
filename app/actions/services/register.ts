'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getNextMaintenancePrediction } from '@/domain/maintenance/service'

const registerServiceSchema = z.object({
  vehicle_id: z.string().uuid(),
  service_type_id: z.string().uuid(),
  odometer: z.coerce.number().int().nonnegative(),
  amount: z.coerce.number().nonnegative(),
  performed_at: z.coerce.date(),
  next_service_date: z.coerce.date().optional(),
  next_service_odometer: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().optional(),
})

export async function registerService(formData: FormData) {
  const data = registerServiceSchema.safeParse(Object.fromEntries(formData))

  if (!data.success) {
    console.error(data.error)
    return { error: 'Dados inválidos' }
  }

  const { vehicle_id, service_type_id, odometer, amount, performed_at, next_service_date, next_service_odometer, notes } = data.data
  const supabase = await createClient()

  // Fetch vehicle details
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('customer_id, current_km')
    .eq('id', vehicle_id)
    .single()

  if (vehicleError || !vehicle) {
    throw new Error("Veículo não encontrado")
  }
  const customer_id = vehicle.customer_id

  // 1. Inserir no histórico
  const { error: recordError } = await supabase
    .from('service_records')
    .insert({
      customer_id,
      vehicle_id,
      service_type_id,
      odometer,
      amount,
      performed_at: performed_at.toISOString(),
      notes
    })

  if (recordError) {
    console.error('Supabase error DETAILS:', JSON.stringify(recordError, null, 2));
    throw new Error(`Erro ao registrar serviço: ${recordError.message}`)
  }

  // 2. Atualizar KM do veículo (apenas se for maior que o atual)
  if (odometer > (vehicle.current_km || 0)) {
    await supabase
      .from('vehicles')
      .update({ current_km: odometer })
      .eq('id', vehicle_id)
  }

  // 3. Upsert na previsão de manutenção (se fornecido)
  if (next_service_date || next_service_odometer) {
    await supabase
      .from('maintenance_predictions')
      .upsert({
        vehicle_id,
        service_type_id,
        predicted_date: next_service_date?.toISOString(),
        predicted_odometer: next_service_odometer,
        status: 'UPCOMING',
        contact_start_date: next_service_date ? new Date(next_service_date.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString() : undefined
      }, { onConflict: 'vehicle_id, service_type_id' })
  }

  // 4. Revalidar
  revalidatePath(`/clientes/${customer_id}`)
  return { success: true }
}
