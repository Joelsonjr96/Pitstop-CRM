'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { customerSchema } from '@/lib/validations/customer'

export async function createCustomer(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validated = customerSchema.safeParse(data)

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors } as unknown as void
  }

  const supabase = await createClient()

  const { error } = await supabase.from('customers').insert([validated.data])

  if (error) {
    if (error.code === '23505') {
      return { error: { phone: ['Este telefone já está cadastrado'] } }
    }
    return { error: error.message }
  }

  revalidatePath('/clientes')
  redirect('/clientes')
  return
}
