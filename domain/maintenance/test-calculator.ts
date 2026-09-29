import { calculateNextMaintenance } from './calculator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testCalculator() {
  console.log("Running calculator tests...");

  const serviceType = {
    id: '1',
    name: 'Troca de Óleo',
    intervalKm: 10000,
    intervalMonths: 6
  };

  const result = calculateNextMaintenance({
    serviceType,
    current_km: 50000,
    serviceDate: new Date('2026-01-01'),
    previousServices: []
  });

  assert(result.predictedOdometer === 60000, 'KM de previsão incorreto');
  console.log("Calculator tests passed!");
}

try {
  testCalculator();
} catch (e) {
  console.error(e);
  process.exit(1);
}
