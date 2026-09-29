'use client'

import { useActionState } from 'react'
import { createCustomer } from '@/app/actions/customers/create'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneInput } from '@/components/PhoneInput'

export default function NovoClientePage() {
  const [state, formAction, isPending] = useActionState(createCustomer, null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Novo Cliente</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nome</label>
              <input id="name" name="name" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Telefone</label>
              <PhoneInput />
            </div>
            <Button type="submit">Cadastrar Cliente</Button>
            {state?.error && <p className="text-red-500 text-sm">{typeof state.error === 'string' ? state.error : 'Erro ao cadastrar'}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
