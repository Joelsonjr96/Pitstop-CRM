-- Script de semeadura de dados de teste para o CRM PitStop
-- Limpa dados existentes para garantir um estado limpo para testes (CUIDADO EM AMBIENTE DE PRODUÇÃO)
DELETE FROM contact_logs;
DELETE FROM maintenance_predictions;
DELETE FROM service_records;
DELETE FROM vehicles;
DELETE FROM customers;
DELETE FROM service_types;

-- 1. Tipos de Serviço
INSERT INTO service_types (id, name, interval_km, interval_months, contact_lead_days) VALUES
('s1-troca-oleo', 'Troca de Óleo', 10000, 6, 15),
('s2-freios', 'Manutenção de Freios', 20000, 12, 30);

-- 2. Clientes
INSERT INTO customers (id, name, phone, email) VALUES
('c1-vip', 'João Silva', '11999990001', 'joao@example.com'),
('c2-critico', 'Maria Oliveira', '11999990002', 'maria@example.com'),
('c3-novo', 'Carlos Santos', '11999990003', 'carlos@example.com'),
('c4-multi', 'Ana Paula', '11999990004', 'ana@example.com');

-- 3. Veículos
INSERT INTO vehicles (id, customer_id, plate, brand, model, year, current_km) VALUES
('v1-civic', 'c1-vip', 'ABC1234', 'Honda', 'Civic', 2022, 45000),
('v2-gol', 'c2-critico', 'XYZ9876', 'VW', 'Gol', 2018, 120000),
('v3-hb20', 'c3-novo', 'DEF5678', 'Hyundai', 'HB20', 2024, 5000),
('v4-uno', 'c4-multi', 'GHI1122', 'Fiat', 'Uno', 2015, 150000),
('v5-palio', 'c4-multi', 'JKL3344', 'Fiat', 'Palio', 2016, 110000);

-- 4. Registros de Serviço (Histórico)
INSERT INTO service_records (id, vehicle_id, service_type_id, performed_at, odometer) VALUES
-- Cliente VIP: Em dia
('r1-oleo', 'v1-civic', 's1-troca-oleo', NOW() - INTERVAL '3 months', 40000),
-- Cliente Crítico: Atrasado (última revisão há 1 ano)
('r2-oleo', 'v2-gol', 's1-troca-oleo', NOW() - INTERVAL '12 months', 100000);

-- 5. Previsões de Manutenção (Para o Dashboard)
INSERT INTO maintenance_predictions (id, vehicle_id, service_type_id, predicted_date, status, predicted_km) VALUES
-- Cliente VIP: Próximo (Upcoming)
('p1-proximo', 'v1-civic', 's1-troca-oleo', NOW() + INTERVAL '1 month', 'UPCOMING', 50000),
-- Cliente Crítico: Atrasado (Late)
('p2-atrasado', 'v2-gol', 's1-troca-oleo', NOW() - INTERVAL '2 months', 'ATRASADO', 110000);
