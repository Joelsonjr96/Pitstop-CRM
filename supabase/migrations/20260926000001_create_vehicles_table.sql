-- 1. Tabela: vehicles
CREATE TABLE vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plate TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT,
    year INTEGER,
    fuel TEXT,
    current_km INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access vehicles" ON vehicles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
