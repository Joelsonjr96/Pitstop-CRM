'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
  service_id: z.string().uuid(),
  customer_id: z.string().uuid(),
})

export async function deleteService(formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) {
    console.error('Validation error:', result.error)
    return { error: 'Dados inválidos.' }
  }

  const { service_id, customer_id } = result.data
  const supabase = await createClient()

  // Antes de deletar o record, precisamos limpar as referências em maintenance_predictions
  const { error: predictionError } = await supabase
    .from('maintenance_predictions')
    .delete()
    .eq('service_record_id', service_id)

  if (predictionError) {
    console.error('Supabase error (predictions):', predictionError)
    return { error: 'Erro ao remover referências de manutenção.' }
  }

  const { error } = await supabase
    .from('service_records')
    .delete()
    .eq('id', service_id)

  if (error) {
    console.error('Supabase error:', error)
    return { error: error.message }
  }

  revalidatePath(`/clientes/${customer_id}`)
  return { success: true }
}
