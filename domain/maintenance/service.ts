import { createClient } from '@/lib/supabase/server'
import { calculateNextMaintenance } from '@/domain/maintenance/calculator'
import { ServiceTypeConfig } from '@/domain/maintenance/types'

export async function getNextMaintenancePrediction(
  vehicle_id: string,
  service_type_id: string,
  current_km: number,
  performed_at: Date
) {
  const supabase = await createClient()

  // 1. Buscar configuração do tipo de serviço
  const { data: serviceType, error: serviceTypeError } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', service_type_id)
    .single()

  if (serviceTypeError) throw new Error("Erro ao buscar tipo de serviço")

  // 2. Buscar histórico
  const { data: previousServices } = await supabase
    .from('service_records')
    .select('*')
    .eq('vehicle_id', vehicle_id)
    .order('performed_at', { ascending: true })

  // 3. Transformar para o formato do calculator
  const formattedPrevious = previousServices?.map(s => ({
    ...s,
    performedAt: new Date(s.performed_at)
  })) || []

  // 4. Calcular usando domínio
  return calculateNextMaintenance({
    serviceType: {
      id: serviceType.id,
      name: serviceType.name,
      intervalKm: serviceType.interval_km,
      intervalMonths: serviceType.interval_months
    } as ServiceTypeConfig,
    current_km,
    serviceDate: performed_at,
    previousServices: formattedPrevious
  })
}
