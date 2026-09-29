-- 1. Tabela: maintenance_predictions
CREATE TABLE maintenance_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_record_id UUID NOT NULL REFERENCES service_records(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    predicted_date TIMESTAMP WITH TIME ZONE NOT NULL,
    predicted_odometer INTEGER NOT NULL,
    calculation_method TEXT NOT NULL,
    status TEXT DEFAULT 'UPCOMING',
    contact_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE maintenance_predictions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access maintenance_predictions" ON maintenance_predictions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
