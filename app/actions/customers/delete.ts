'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteCustomer(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  // Note: This may fail if there are dependent records like vehicles and this
  // schema doesn't have ON DELETE CASCADE set.
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}
