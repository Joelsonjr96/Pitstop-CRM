import { createClient } from '@/lib/supabase/client'

export async function getCustomerDetails(id: string) {
  const supabase = await createClient()

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (customerError || !customer) {
    return null
  }

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('customer_id', id)

  const { data: records } = await supabase
    .from('service_records')
    .select('*, service_types (name), vehicles (plate, brand, model)')
    .eq('customer_id', id)

  const { data: contacts } = await supabase
    .from('contact_logs')
    .select('*, vehicles(*)')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  return { customer, vehicles, records, contacts }
}

export async function searchCustomers(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*, vehicles(*)')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
    .limit(10)

  if (error) return []
  return data
}

export async function getServiceTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('name')

  if (error) return []
  return data
}
