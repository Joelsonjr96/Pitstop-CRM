-- 1. Tabela: contact_logs
CREATE TABLE contact_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    maintenance_prediction_id UUID REFERENCES maintenance_predictions(id),
    channel TEXT NOT NULL, -- WHATSAPP, PHONE, PRESENTIAL
    action TEXT NOT NULL, -- WHATSAPP_OPENED, MESSAGE_SENT, NO_RESPONSE, etc.
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE contact_logs ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access contact_logs" ON contact_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
