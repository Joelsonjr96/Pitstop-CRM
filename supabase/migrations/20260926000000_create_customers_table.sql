-- 1. Tabela: customers
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    cpf TEXT,
    notes TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Política simples: Usuários autenticados podem ler e escrever
CREATE POLICY "Authenticated users can access customers" ON customers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
