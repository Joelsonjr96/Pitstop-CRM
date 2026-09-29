import { createClient } from '@/lib/supabase/server'
import { ServiceTypeDialog } from '@/components/ServiceTypeDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ServiceTypesPage() {
  const supabase = await createClient()
  const { data: serviceTypes } = await supabase.from('service_types').select('*').order('name')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Serviço</h1>
        <ServiceTypeDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Intervalo (KM)</TableHead>
              <TableHead>Intervalo (Meses)</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceTypes?.map((st) => (
              <TableRow key={st.id}>
                <TableCell className="font-medium">{st.name}</TableCell>
                <TableCell>{st.interval_km.toLocaleString('pt-BR')}</TableCell>
                <TableCell>{st.interval_months}</TableCell>
                <TableCell>
                  <ServiceTypeDialog serviceType={st} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
