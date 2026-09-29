'use client'

import { MoreHorizontal } from "lucide-react"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function CustomerActions({ customerId }: { customerId: string }) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/clientes/${customerId}`}>Ver detalhes</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}
