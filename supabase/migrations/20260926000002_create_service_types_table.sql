-- 1. Tabela: service_types
CREATE TABLE service_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    interval_km INTEGER NOT NULL,
    interval_months INTEGER NOT NULL,
    contact_lead_days INTEGER DEFAULT 15,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access service_types" ON service_types
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
