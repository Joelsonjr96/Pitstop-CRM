'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { upsertServiceType, deleteServiceType } from '@/app/actions/service-types'
// import { createServiceType } from '@/app/actions/service-types/create' // Verifique se isso existe por engano
import { useToast } from '@/components/ui/toaster'
import { Plus, Pencil } from 'lucide-react'

export function ServiceTypeDialog({ serviceType }: { serviceType?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    // Force usar a função correta
    const result = await upsertServiceType(formData)
    if (result.error) {
      toast({ message: `Erro: ${result.error}`, type: 'error' })
    } else {
      toast({ message: 'Tipo de serviço salvo com sucesso!', type: 'success' })
      setIsOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este tipo de serviço?')) return
    const result = await deleteServiceType(serviceType.id)
    if (result.error) {
      toast({ message: `Erro: ${result.error}`, type: 'error' })
    } else {
      toast({ message: 'Tipo de serviço excluído!', type: 'success' })
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant={serviceType ? "ghost" : "default"} size="sm" onClick={() => setIsOpen(true)}>
        {serviceType ? <Pencil className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Novo Serviço</>}
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={serviceType ? "Editar Serviço" : "Novo Tipo de Serviço"}
      >
        <form action={handleSubmit} className="space-y-4">
          {serviceType && <input type="hidden" name="id" value={serviceType.id} />}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Nome</label>
            <input name="name" defaultValue={serviceType?.name} required className="w-full border rounded-md p-2 text-sm bg-background" />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Intervalo (KM)</label>
                <input
                  name="interval_km"
                  type="text"
                  defaultValue={serviceType?.interval_km?.toLocaleString('pt-BR')}
                  required
                  className="w-full border rounded-md p-2 text-sm bg-background"
                  onBlur={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = new Intl.NumberFormat('pt-BR').format(parseInt(value) || 0);
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Intervalo (Meses)</label>
                <input name="interval_months" type="number" defaultValue={serviceType?.interval_months} required className="w-full border rounded-md p-2 text-sm bg-background" />
              </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
            {serviceType && (
              <Button type="button" variant="destructive" onClick={handleDelete}>Excluir</Button>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}
