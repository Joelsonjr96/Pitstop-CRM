'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const logContactSchema = z.object({
  customer_id: z.string().uuid(),
  maintenance_prediction_id: z.string().uuid().optional().nullable(),
  action: z.string().min(1),
  notes: z.string().optional(),
})

export async function logContact(formData: FormData) {
  const data = logContactSchema.safeParse(Object.fromEntries(formData))

  if (!data.success) {
    console.error(data.error)
    return { error: 'Dados inválidos' }
  }

  const { customer_id, maintenance_prediction_id, action, notes } = data.data
  const supabase = await createClient()

  // 1. Logar o contato
  await supabase.from('contact_logs').insert([
    {
      customer_id,
      maintenance_prediction_id,
      channel: 'WHATSAPP',
      action,
      notes
    }
  ])

  // 2. Atualizar status da previsão
  if (maintenance_prediction_id) {
    let status = 'CONTACTED'
    if (action === 'CUSTOMER_DECLINED') status = 'CANCELLED'
    if (action === 'APPOINTMENT_SCHEDULED') status = 'SCHEDULED'

    await supabase
      .from('maintenance_predictions')
      .update({ status })
      .eq('id', maintenance_prediction_id)
  }

  revalidatePath('/dashboard')
  return { success: true }
}