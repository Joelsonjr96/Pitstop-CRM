'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { deleteService } from '@/app/actions/services/delete'

export function ServiceRowActions({ serviceId, customerId }: { serviceId: string, customerId: string }) {
  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
      const formData = new FormData()
      formData.append('service_id', serviceId)
      formData.append('customer_id', customerId)
      const result = await deleteService(formData)
      if (result?.success) {
        window.location.reload()
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive p-0">
          <button onClick={handleDelete} className="w-full text-left px-2 py-1.5">
            Excluir
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
