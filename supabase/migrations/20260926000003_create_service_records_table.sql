-- 1. Tabela: service_records
CREATE TABLE service_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    odometer INTEGER NOT NULL,
    value DECIMAL(10, 2),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access service_records" ON service_records
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
