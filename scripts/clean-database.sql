-- Comando para limpar todos os dados de cliente (PitStop CRM)
-- Execução irreversível — confirma antes de rodar
TRUNCATE TABLE service_records, customers, vehicles, maintenance_predictions, contact_logs CASCADE;
