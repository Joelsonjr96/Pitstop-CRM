'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { registerService } from './register'

// For simplicity, let's assume we handle creation if IDs are not provided or if a flag is set.
// This gets complex quickly. Let's start with a simpler approach:
// 1. A form that either takes a vehicleId (if customer/vehicle chosen)
// 2. OR creates customer+vehicle then calls registerService.

export async function registerFullService(prevState: any, formData: FormData) {
  const supabase = await createClient()
  let vehicle_id = formData.get('vehicle_id') as string

  if (!vehicle_id) {
    // Need to create customer and vehicle
    const customerName = formData.get('customer_name') as string
    const customerPhone = formData.get('customer_phone') as string

    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({ name: customerName, phone: customerPhone })
        .select()
        .single()

    if (customerError) return { error: 'Erro ao criar cliente' } as unknown as void

    const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
            customer_id: customer.id,
            plate: formData.get('plate'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year') as string),
            current_km: parseInt((formData.get('current_km') as string || '0').replace(/\D/g, ''))
        })
        .select()
        .single()

    if (vehicleError) return { error: 'Erro ao criar veículo' } as unknown as void
    vehicle_id = vehicle.id
  }

  // Now we have a vehicle_id, we can reuse the existing registerService logic
  // But registerService expects FormData. Let's just call the logic directly or reuse the action.

  // To reuse registerService, we need to construct new FormData
  const serviceFormData = new FormData()
  serviceFormData.append('vehicle_id', vehicle_id)
  serviceFormData.append('service_type_id', formData.get('service_type_id') as string)
  serviceFormData.append('odometer', formData.get('odometer') as string)
  serviceFormData.append('amount', formData.get('amount') as string)
  serviceFormData.append('performed_at', formData.get('performed_at') as string)
  serviceFormData.append('notes', formData.get('notes') as string)

  return await registerService(serviceFormData)
}
