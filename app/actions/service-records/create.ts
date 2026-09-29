'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateNextMaintenance } from '@/domain/maintenance/calculator'

export type ActionState = { error?: string | null; success?: boolean }

export async function createServiceRecord(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const customer_id = formData.get('customer_id') as string
  const vehicle_id = formData.get('vehicle_id') as string
  const service_type_id = formData.get('service_type_id') as string
  const odometer = parseInt(formData.get('odometer') as string)
  const value = parseFloat(formData.get('value') as string)
  const notes = formData.get('notes') as string

  const supabase = await createClient()

  // 1. Registrar o serviço
  // Buscar último serviço para validar KM
  const { data: lastService } = await supabase
    .from('service_records')
    .select('odometer')
    .eq('vehicle_id', vehicle_id)
    .order('odometer', { ascending: false })
    .limit(1)
    .single();

  if (lastService && odometer <= lastService.odometer) {
    return { error: `A quilometragem informada (${odometer} km) não pode ser menor ou igual à última registrada (${lastService.odometer} km).` };
  }

  const { data: record, error: recordError } = await supabase
    .from('service_records')
    .insert([
      { customer_id, vehicle_id, service_type_id, odometer, value, notes }
    ])
    .select()
    .single()

  if (recordError || !record) {
    return { error: recordError?.message || 'Erro ao registrar serviço' }
  }

  // 2. Atualizar KM atual do veículo
  await supabase
    .from('vehicles')
    .update({ current_km: odometer })
    .eq('id', vehicle_id)

  // 3. Gerar previsão (Motor de Manutenção)
  const { data: serviceType } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', service_type_id)
    .single()

  if (serviceType) {
    // Buscar histórico para o motor de previsão
    const { data: history } = await supabase
      .from('service_records')
      .select('id, performed_at, odometer')
      .eq('vehicle_id', vehicle_id)
      .eq('service_type_id', service_type_id)
      .order('performed_at', { ascending: true })

    const previousServices = history?.map(h => ({
      id: h.id,
      performedAt: new Date(h.performed_at),
      odometer: h.odometer
    })) || []

    try {
      const prediction = calculateNextMaintenance({
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          intervalKm: serviceType.interval_km,
          intervalMonths: serviceType.interval_months,
        },
        current_km: odometer,
        serviceDate: new Date(record.performed_at),
        previousServices
      })

      // Calcular data de início do contato
      const contactStartDate = new Date(prediction.predictedDate)
      contactStartDate.setDate(contactStartDate.getDate() - serviceType.contact_lead_days)

      // Inativar previsões pendentes anteriores para este veículo e tipo de serviço
      await supabase
        .from('maintenance_predictions')
        .update({ status: 'CANCELLED' })
        .eq('vehicle_id', vehicle_id)
        .eq('service_type_id', service_type_id)
        .in('status', ['UPCOMING', 'CONTACT_WINDOW']);

      await supabase.from('maintenance_predictions').insert([
        {
          service_record_id: record.id,
          vehicle_id,
          service_type_id,
          predicted_date: prediction.predictedDate,
          predicted_odometer: prediction.predictedOdometer,
          calculation_method: prediction.calculationMethod,
          contact_start_date: contactStartDate,
          status: 'UPCOMING'
        }
      ])
    } catch (e: any) {
      console.error("Erro ao calcular previsão:", e.message)
      // Continua mesmo se falhar a previsão (para não travar o registro do serviço)
    }
  }

  revalidatePath(`/clientes/${customer_id}`)
  return { success: true }
}
