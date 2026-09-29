// domain/maintenance/calculator.ts

import { ServiceTypeConfig, ServiceRecord, NextMaintenancePrediction, CalculationMethod } from './types';

interface MaintenanceCalculatorParams {
  serviceType: ServiceTypeConfig;
  current_km: number;
  serviceDate: Date;
  previousServices?: ServiceRecord[];
}

export function calculateNextMaintenance({
  serviceType,
  current_km,
  serviceDate,
  previousServices = []
}: MaintenanceCalculatorParams): NextMaintenancePrediction {

  // 1. Validação de KM (Seção 13)
  if (previousServices.length > 0) {
    const lastService = previousServices[previousServices.length - 1];
    if (current_km < lastService.odometer) {
      throw new Error("Quilometragem atual é menor que a do último serviço registrado.");
    }
  }

  const { intervalKm, intervalMonths } = serviceType;

  // 2. Cálculo por Tempo (Base)
  const dateByTime = new Date(serviceDate);
  dateByTime.setMonth(dateByTime.getMonth() + intervalMonths);

  // 3. Cálculo por KM (Base)
  const kmByInterval = current_km + intervalKm;

  // 4. Se tiver histórico, calcula a média de uso (Seção 10 e 12)
  if (previousServices.length >= 1) {
    // Calcula os intervalos de KM entre os serviços
    const intervals: number[] = [];
    for (let i = 1; i < previousServices.length; i++) {
      intervals.push(previousServices[i].odometer - previousServices[i - 1].odometer);
    }

    // Adiciona o intervalo do último serviço para o atual
    intervals.push(current_km - previousServices[previousServices.length - 1].odometer);

    // Usa a média dos últimos 2 intervalos, ou apenas o último se houver só um
    const recentIntervals = intervals.slice(-2);
    const avgIntervalKm = recentIntervals.reduce((a, b) => a + b, 0) / recentIntervals.length;

    // Estima usando a média dos intervalos em vez do intervalo fixo
    const effectiveIntervalKm = Math.min(avgIntervalKm, intervalKm);

    const lastService = previousServices[previousServices.length - 1];
    const daysDiff = (serviceDate.getTime() - lastService.performedAt.getTime()) / (1000 * 60 * 60 * 24);
    const kmDiff = current_km - lastService.odometer;

    if (daysDiff > 0) {
      const dailyUsage = kmDiff / daysDiff;

      if (dailyUsage > 0) {
        // Estima quantos dias leva para atingir o intervalo de KM
        const daysToNextInterval = effectiveIntervalKm / dailyUsage;
        const predictedDateByKm = new Date(serviceDate);
        predictedDateByKm.setDate(predictedDateByKm.getDate() + Math.round(daysToNextInterval));

        // Compara: o que ocorre primeiro? A data fixa do intervalo ou a estimativa por KM?
        if (predictedDateByKm < dateByTime) {
          return {
            predictedDate: predictedDateByKm,
            predictedOdometer: current_km + Math.round(effectiveIntervalKm),
            calculationMethod: 'HISTORICAL_AVERAGE'
          };
        }
      }
    }
  }

  // 5. Retorna o primeiro limite atingido (Padrão)
  return {
    predictedDate: dateByTime,
    predictedOdometer: kmByInterval,
    calculationMethod: 'TIME_AND_KM'
  };
}
