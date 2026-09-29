-- Inserir Cliente de Teste
INSERT INTO customers (id, name, phone, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Anderson Silva', '21999999999', 'anderson@example.com');

-- Inserir Veículo de Teste
INSERT INTO vehicles (id, customer_id, plate, brand, model, current_km)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ABC1234', 'Honda', 'Civic', 50000);

-- Inserir Tipo de Serviço de Teste
INSERT INTO service_types (id, name, interval_km, interval_months, contact_lead_days)
VALUES ('00000000-0000-0000-0000-000000000003', 'Troca de Óleo', 10000, 6, 15);
