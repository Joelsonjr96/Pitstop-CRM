// domain/maintenance/types.ts

export type CalculationMethod =
  | 'TIME_ONLY'
  | 'KM_ONLY'
  | 'TIME_AND_KM'
  | 'HISTORICAL_AVERAGE';

export interface ServiceTypeConfig {
  id: string;
  name: string;
  intervalKm: number;
  intervalMonths: number;
}

export interface ServiceRecord {
  id: string;
  performedAt: Date;
  odometer: number;
}

export interface NextMaintenancePrediction {
  predictedDate: Date; // A data que vai ocorrer primeiro (Time ou Km)
  predictedOdometer: number; // A KM que vai ocorrer primeiro
  calculationMethod: CalculationMethod;
}
