-- 1. Tabela: message_templates
CREATE TABLE message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    trigger TEXT, -- ex: 'maintenance_reminder'
    message TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access message_templates" ON message_templates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
