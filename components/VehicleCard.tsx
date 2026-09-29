'use client'

import { Card } from '@/components/ui/card'
import { RegisterServiceDialog } from '@/components/RegisterServiceDialog'
import { VehicleEditDialog } from './VehicleEditDialog'
import { Trash2, Calendar, Settings, Droplets, Activity, AlertTriangle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteVehicle } from '@/app/actions/vehicles/delete'
import { logContact } from '@/app/actions/contacts/log'
import { Badge } from '@/components/ui/badge'
import { predictNextService } from '@/domain/vehicles/maintenance'
import { capitalizeWords, formatPlate, formatOilViscosity } from '@/lib/utils'
import { generateMaintenanceMessage } from '@/lib/whatsapp'

export function VehicleCard({ vehicle, lastService, vehicleRecords, serviceTypes, customer }: { vehicle: any, lastService?: any, vehicleRecords: any[], serviceTypes: any[], customer: any }) {
  const previousService = vehicleRecords
    ?.filter(r => r.id !== lastService?.id)
    ?.sort((a, b) => (b.odometer || 0) - (a.odometer || 0))[0];

  const prediction = predictNextService(vehicle, lastService, previousService);

  const handleSendReminder = async () => {
    const url = generateMaintenanceMessage(
      customer.name,
      customer.phone,
      `${vehicle.brand} ${vehicle.model}`,
      vehicle.plate,
      lastService?.service_types?.name || 'Serviço',
      prediction?.targetDate.toLocaleDateString('pt-BR') || ''
    );

    // Registrar contato
    const formData = new FormData();
    formData.append('customer_id', customer.id);
    formData.append('action', 'Lembrete de manutenção enviado');
    await logContact(formData);

    window.open(url, '_blank');
  };

  return (
    <Card className="p-4 space-y-4 bg-muted/30 border-zinc-800">
      {/* Título e Badge */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground">
          {capitalizeWords(vehicle.brand)} {capitalizeWords(vehicle.model)}
          <Badge variant="neutral" className="ml-2 font-mono">{formatPlate(vehicle.plate)}</Badge>
        </h3>
        <div className="flex gap-2">
          <RegisterServiceDialog
            vehicle={vehicle}
            serviceTypes={serviceTypes}
            onSuccess={() => window.location.reload()}
          />
          <VehicleEditDialog vehicle={vehicle} />
          <form action={async (formData) => {
            if (confirm('Tem certeza que deseja excluir este veículo?')) {
              await deleteVehicle(formData);
            }
          }} className="contents">
            <input type="hidden" name="vehicle_id" value={vehicle.id} />
            <input type="hidden" name="customer_id" value={vehicle.customer_id} />
            <Button variant="destructive" size="sm" type="submit">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Alerta de Manutenção */}
      {prediction && (
          <div className={`p-3 rounded-lg border flex items-center gap-3 ${prediction.isAlert ? 'border-amber-200 bg-amber-500/10' : 'border-border bg-muted/50'}`}>
              <AlertTriangle className={`h-5 w-5 ${prediction.isAlert ? 'text-amber-500' : 'text-primary'}`} />
              <div className="flex-1 text-sm">
                  <p className="font-medium text-foreground">
                    Próxima revisão em: {prediction.targetKm.toLocaleString('pt-BR')} km ou em {prediction.targetDate.toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {prediction.remainingKm > 0
                        ? `Faltam ${prediction.remainingKm.toLocaleString('pt-BR')} km`
                        : `Atrasada em ${Math.abs(prediction.remainingKm).toLocaleString('pt-BR')} km`}
                  </p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSendReminder}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
              </Button>
          </div>
      )}


      {/* Especificações Técnicas - Hierarquia Dark Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Ano:</span>
            <span className="font-medium text-foreground">{vehicle.year}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Câmbio:</span>
            <span className="font-medium text-foreground">{vehicle.transmission_type || 'N/A'}</span>
        </div>
        {vehicle.transmission_type === 'Automático' && vehicle.transmission_oil_type && (
          <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Óleo Câmbio:</span>
              <span className="font-medium text-foreground">{formatOilViscosity(vehicle.transmission_oil_type)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Óleo Motor:</span>
            <span className="font-medium text-foreground">{formatOilViscosity(vehicle.oil_type || 'N/A')}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">KM:</span>
            <span className="font-medium text-foreground">
              {lastService?.odometer
                ? `${lastService.odometer.toLocaleString('pt-BR')} km`
                : (vehicle.current_km ? `${vehicle.current_km.toLocaleString('pt-BR')} km` : 'N/A')}
            </span>
        </div>
      </div>

      {/* Histórico de Serviços (Resumo) */}
      <div className="text-sm border-t border-zinc-800 pt-3">
        <h4 className="font-semibold text-foreground mb-1">Último Serviço</h4>
        {lastService ? (
          <div className="space-y-1">
            <p className="text-foreground font-medium">
              {lastService.service_types?.name}
              <span className="text-muted-foreground font-normal ml-2">em {new Date(lastService.performed_at).toLocaleDateString('pt-BR')}</span>
            </p>
            {lastService.next_service_date && (
              <p className="text-xs text-muted-foreground">
                Próxima revisão: {new Date(lastService.next_service_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2 rounded-md border border-dashed border-border">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Nenhum serviço registrado para este veículo.</span>
          </div>
        )}
      </div>
    </Card>
  )
}
