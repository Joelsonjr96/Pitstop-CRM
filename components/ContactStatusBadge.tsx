'use client';

import { useState } from 'react';

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  NOT_CONTACTED: { label: 'Não Contatado', bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' },
  MESSAGE_SENT: { label: 'Mensagem Enviada', bg: 'bg-amber-900/30', text: 'text-amber-300', border: 'border-amber-700/40' },
  SCHEDULED: { label: 'Agendado', bg: 'bg-emerald-900/30', text: 'text-emerald-300', border: 'border-emerald-700/40' },
};

export default function ContactStatusBadge({
  initial = 'NOT_CONTACTED',
  predictionId,
  customerId,
}: {
  initial?: string;
  predictionId: string;
  customerId: string;
}) {
  const [status, setStatus] = useState(initial);
  const s = STATUS_MAP[status] || STATUS_MAP.NOT_CONTACTED;

  const handleClick = async () => {
    try {
      const formData = new FormData();
      formData.append('customer_id', customerId);
      formData.append('maintenance_prediction_id', predictionId);
      formData.append('action', 'MESSAGE_SENT');
      const { logContact } = await import('@/app/actions/contacts/log');
      await logContact(formData);
      setStatus('MESSAGE_SENT');
    } catch {
      setStatus('MESSAGE_SENT');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors ${s.bg} ${s.text} ${s.border} hover:brightness-110`}
      title="Clique para marcar contato"
    >
      {s.label}
    </button>
  );
}
