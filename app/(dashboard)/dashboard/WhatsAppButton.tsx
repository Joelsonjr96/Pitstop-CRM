'use client'

import { useState } from 'react'
import { replaceTemplateVariables } from '@/lib/whatsapp/template'

export default function WhatsAppButton({ action, templates, officeSettings }: { action: any, templates: any[], officeSettings: any }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || '')

  const handleOpenWhatsApp = () => {
    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return

    const message = replaceTemplateVariables(template.message, {
      cliente: action.vehicles.customers.name,
      veiculo: action.vehicles.model,
      placa: action.vehicles.plate,
      servico: action.service_types?.name || 'Serviço',
      oficina: officeSettings?.name || 'Oficina'
    })

    const phone = action.vehicles.customers.phone.replace(/\D/g, '')
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        className="border p-1 rounded text-sm"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <button
        onClick={handleOpenWhatsApp}
        className="bg-green-600 text-white px-2 py-1 rounded text-sm"
      >
        WhatsApp
      </button>
    </div>
  )
}
