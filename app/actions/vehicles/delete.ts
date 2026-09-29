'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  vehicle_id: z.string().uuid(),
  customer_id: z.string().uuid(),
})

export async function deleteVehicle(formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) {
    console.error('Validation error:', result.error)
    return { error: 'Dados inválidos.' }
  }

  const { vehicle_id, customer_id } = result.data
  const supabase = await createClient()

  console.log('Deleting vehicle:', vehicle_id)

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicle_id)

  if (error) {
    console.error('Supabase error:', error)
    return { error: error.message }
  }

  console.log('Vehicle deleted successfully')

  revalidatePath(`/clientes/${customer_id}`)
}
