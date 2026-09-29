import { notFound } from 'next/navigation'
import { AddVehicleDialog } from '@/components/AddVehicleDialog'
import { Badge } from '@/components/ui/badge'
import { deleteCustomer } from '@/app/actions/customers/delete'
import { RegisterServiceDialog } from '@/components/RegisterServiceDialog'
import { getServiceTypes } from '@/domain/customers/queries'
import { Plus, Phone, Car, Trash2, Pencil, History } from "lucide-react"
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VehicleCard } from '@/components/VehicleCard'
import { getCustomerDetails } from '@/domain/customers/queries'
import { DeleteCustomerDialog } from '@/components/DeleteCustomerDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { capitalizeWords, formatPlate } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ServiceRowActions } from '@/components/ServiceRowActions'

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const data = await getCustomerDetails(id)
  const serviceTypes = await getServiceTypes()

  if (!data) {
    notFound()
  }

  const { customer, vehicles, records, contacts } = data;

  // Calcula histórico de gastos (apenas concluídos)
  const totalSpent = records?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;



  return (
    <div className="space-y-6">
      {/* Header do Cliente - Limpo */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{customer.name}</h1>
            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="font-mono text-sm">{customer.phone}</span>
              </a>
              <span className="text-border">|</span>
              <span className="text-sm">
                <strong className="text-foreground">{vehicles?.length || 0}</strong> {vehicles?.length === 1 ? 'veículo' : 'veículos'}
              </span>
              <span className="text-border">|</span>
              <span className="text-sm">
                Gasto total: <strong className="text-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}</strong>
              </span>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href={`/clientes/${customer.id}/editar`}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                </Link>
            </Button>
            <DeleteCustomerDialog customerId={customer.id} action={deleteCustomer} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo em Abas */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="vehicles" className="w-full">
            <TabsList>
              <TabsTrigger value="vehicles">Veículos</TabsTrigger>
              <TabsTrigger value="services">Ordens de Serviço</TabsTrigger>
              <TabsTrigger value="history">Histórico de Contato</TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Veículos Cadastrados</h2>
                <AddVehicleDialog customerId={customer.id} />
              </div>

              <div className="grid gap-4">
                {vehicles?.map(vehicle => {
                  const vehicleRecords = records?.filter(r => r.vehicle_id === vehicle.id) || [];
                  const lastService = vehicleRecords.sort((a, b) => (b.odometer || 0) - (a.odometer || 0))[0];

                  return (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      lastService={lastService}
                      vehicleRecords={vehicleRecords}
                      serviceTypes={serviceTypes}
                      customer={customer}
                    />
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <h2 className="font-bold text-lg">Ordens de Serviço</h2>
                </CardHeader>
                <CardContent>
                  {records && records.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Serviço</TableHead>
                            <TableHead>KM</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {records.map((record) => (
                            <TableRow key={record.id} className="align-middle">
                              <TableCell className="align-middle">{new Date(record.performed_at).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell className="align-middle">
                                <div className="font-medium">
                                  {capitalizeWords(record.vehicles?.brand || '')} {capitalizeWords(record.vehicles?.model || '')}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {formatPlate(record.vehicles?.plate || '')}
                                </div>
                              </TableCell>
                              <TableCell className="align-middle">
                                <div>{record.service_types?.name || 'Serviço'}</div>
                                {record.notes && record.notes !== 'null' && record.notes.trim() !== '' && (
                                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                    {record.notes}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="align-middle">{record.odometer?.toLocaleString('pt-BR')} km</TableCell>
                              <TableCell className="font-mono align-middle">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(record.amount || 0)}
                              </TableCell>
                              <TableCell className="align-middle">
                                <Badge variant="success">
                                  Concluído
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right align-middle">
                                <ServiceRowActions serviceId={record.id} customerId={customer.id} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma ordem de serviço registrada.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <h2 className="font-bold text-lg">Histórico de Contato</h2>
                </CardHeader>
                <CardContent>
                  {contacts && contacts.length > 0 ? (
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="border-l-2 border-primary/30 pl-4 py-1">
                          <div className="text-xs text-muted-foreground font-mono">{new Date(contact.created_at).toLocaleDateString()}</div>
                          <div className="text-sm font-medium">{contact.action}</div>
                          {contact.vehicles && <div className="text-xs text-muted-foreground">{contact.vehicles.model} ({contact.vehicles.plate})</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum histórico registrado.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
