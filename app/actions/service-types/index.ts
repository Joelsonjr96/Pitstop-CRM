'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const serviceTypeSchema = z.object({
  id: z.string().optional(), // Removed .uuid() to debug
  name: z.string().min(1),
  category: z.string().optional().nullable(),
  interval_km: z.coerce.number().int().positive(),
  interval_months: z.coerce.number().int().positive(),
  contact_lead_days: z.coerce.number().int().nonnegative().default(15),
})

export async function upsertServiceType(formData: FormData) {
  const id = formData.get('id') || formData.get('Id')
  const name = formData.get('name') || formData.get('Name')
  const interval_km = formData.get('interval_km') || formData.get('Interval_km')
  const interval_months = formData.get('interval_months') || formData.get('Interval_months')
  const category = formData.get('category') || formData.get('Category')
  const contact_lead_days = formData.get('contact_lead_days') || formData.get('Contact_lead_days')

  const entries: any = {
    name: name?.toString(),
    interval_km: interval_km?.toString().replace(/\./g, '').replace(',', '.'),
    interval_months: interval_months?.toString(),
    category: category ? category.toString() : null,
  }

  if (contact_lead_days) {
      entries.contact_lead_days = contact_lead_days.toString()
  }

  if (id && id !== 'undefined' && id !== '') {
    entries.id = id.toString().trim()
  }

  console.log('Processed entries:', entries)

  const data = serviceTypeSchema.safeParse(entries)

  if (!data.success) {
    console.error('Validation error:', data.error.format())
    return { error: 'Dados inválidos' }
  }

  const { id: serviceId, ...serviceData } = data.data
  const supabase = await createClient()

  console.log('Upserting service type:', { id: serviceId, ...serviceData })

  const { error } = await supabase
    .from('service_types')
    .upsert({ id: serviceId, ...serviceData })

  if (error) {
    console.error('Supabase error:', error)
    return { error: error.message }
  }

  console.log('Service type upserted successfully')

  revalidatePath('/config/servicos')
  return { success: true }
}

export async function deleteServiceType(id: string) {
  const supabase = await createClient()

  console.log('Attempting to delete service type:', id)

  const { error } = await supabase
    .from('service_types')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase delete error:', error)
    return { error: error.message }
  }

  console.log('Service type deleted successfully')
  revalidatePath('/config/servicos')
  return { success: true }
}
