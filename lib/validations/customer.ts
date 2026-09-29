import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(8, 'Telefone inválido'),
})
