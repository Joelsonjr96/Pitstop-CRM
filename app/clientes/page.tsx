import { MessageCircle, Pencil, Search, ArrowUpDown, Plus } from "lucide-react"
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { CustomerListSkeleton } from '@/components/CustomerListSkeleton'
import { PhoneInput } from '@/components/PhoneInput'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClickableTableRow } from "@/components/ClickableTableRow"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { redirect } from 'next/navigation'

function formatPhone(phone: string) {
  const cleaned = ('' + phone).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}

async function CustomerList({ searchParams }: { searchParams: { q?: string, sort?: string } }) {
  const supabase = await createClient()
  const q = searchParams.q
  const sort = searchParams.sort

  let query = supabase
    .from('customers')
    .select(`
      *,
      vehicles (
        id,
        brand,
        model,
        plate
      ),
      service_records (
        performed_at
      )
    `)

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,vehicles.plate.ilike.%${q}%`)
  }

  if (sort === 'name_desc') {
    query = query.order('name', { ascending: false })
  } else {
    query = query.order('name', { ascending: true })
  }

  const { data: customers } = await query

  const customersWithLastService = customers?.map(customer => {
    const lastService = customer.service_records
      ?.map((s: any) => new Date(s.performed_at))
      .sort((a: any, b: any) => b.getTime() - a.getTime())[0]

    return {
      ...customer,
      lastServiceDate: lastService ? lastService.toLocaleDateString('pt-BR') : 'Nenhuma'
    }
  })

  if (!customersWithLastService || customersWithLastService.length === 0) {
    return (
      <EmptyState
        title="Nenhum cliente encontrado"
        description="Tente ajustar sua busca ou adicione um novo cliente."
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Veículos</TableHead>
            <TableHead>Última Manutenção</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customersWithLastService.map((customer) => (
            <TableRow key={customer.id} className="transition-colors">
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{formatPhone(customer.phone)}</TableCell>
              <TableCell>
                {customer.vehicles?.length ?? 0} veículos
              </TableCell>
              <TableCell>{customer.lastServiceDate}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <a
                    href={`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=Olá!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contatar via WhatsApp"
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <Link
                    href={`/clientes/${customer.id}`}
                    title="Editar Cliente"
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default async function ClientesPage({ searchParams }: { searchParams: { q?: string, sort?: string } }) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <form className="flex gap-2 w-full max-w-md">
           <input
             type="text"
             name="q"
             placeholder="Buscar por nome, telefone ou placa..."
             className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
           />
           <Button type="submit" variant="outline" size="sm">
             <Search className="h-4 w-4" />
           </Button>
        </form>
        <Button asChild size="sm">
            <Link href="/clientes/novo">
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Link>
        </Button>
      </div>
      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerList searchParams={params} />
      </Suspense>
    </div>
  )
}
