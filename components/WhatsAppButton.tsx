'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { replaceTemplateVariables } from '@/lib/whatsapp/template';

interface WhatsAppButtonProps {
  customerName: string;
  vehicle: string;
  plate: string;
  service: string;
  phone: string;
}

export function WhatsAppButton({ customerName, vehicle, plate, service, phone }: WhatsAppButtonProps) {
  const handleWhatsApp = () => {
    const template = "Olá {{cliente}}, tudo bem? Aqui da Oficina, notamos que chegou a hora da manutenção de {{servico}} do seu {{veiculo}} ({{placa}}). Podemos agendar?";
    const message = replaceTemplateVariables(template, {
      cliente: customerName,
      veiculo: vehicle,
      placa: plate,
      servico: service,
      oficina: "Oficina" // Should ideally come from config or context
    });
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
        onClick={handleWhatsApp}
        variant="default"
        size="sm"
        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <MessageSquare className="h-4 w-4" />
      <span>WhatsApp</span>
    </Button>
  );
}
