'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { capitalizeWords, formatPlate, formatOilViscosity } from '@/lib/utils'

const updateVehicleSchema = z.object({
  vehicle_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  brand: z.string().min(1).transform(val => capitalizeWords(val.trim())),
  model: z.string().min(1).transform(val => capitalizeWords(val.trim())),
  plate: z.string().min(1).transform(val => formatPlate(val.trim())),
  year: z.coerce.number().int().min(1900).max(2100),
  current_km: z.coerce.number().int().nonnegative(),
  oil_type: z.string().optional().nullable().transform(val => val ? formatOilViscosity(val.trim()) : val),
  transmission_type: z.string().optional().nullable(),
  transmission_oil_type: z.string().optional().nullable().transform(val => val ? formatOilViscosity(val.trim()) : val),
}).superRefine((data, ctx) => {
  if (data.transmission_type === 'Manual' && data.transmission_oil_type) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Óleo de câmbio não deve ser preenchido para câmbio Manual',
      path: ['transmission_oil_type'],
    })
  }
})

export async function updateVehicle(formData: FormData) {
  const data = updateVehicleSchema.safeParse(Object.fromEntries(formData))

  if (!data.success) {
    console.error(data.error)
    return { error: 'Dados inválidos' }
  }

  const { vehicle_id, customer_id, ...vehicleData } = data.data

  const supabase = await createClient()

  const { error } = await supabase
    .from('vehicles')
    .update(vehicleData)
    .eq('id', vehicle_id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/clientes/${customer_id}`)
  return { success: true }
}
