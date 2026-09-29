export function predictNextService(vehicle: any, currentOS: any, previousOS?: any) {
  if (!currentOS) return null;

  const service = currentOS.service_types || {};
  const intervalKm = service.interval_km || 10000;
  const intervalMonths = service.interval_months || 6;

  const currentOdometer = currentOS.odometer || 0;
  const currentDate = new Date(currentOS.performed_at);

  let targetKm = currentOdometer + intervalKm;
  let targetDate = new Date(currentDate);
  targetDate.setMonth(targetDate.getMonth() + intervalMonths);

  if (previousOS) {
    const prevOdometer = previousOS.odometer || 0;
    const prevDate = new Date(previousOS.performed_at);

    const deltaKm = Math.max(0, currentOdometer - prevOdometer);
    const deltaDays = Math.max(1, (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    const kmPerDay = deltaKm / deltaDays;

    // Média padrão se rodagem for ínfima (ex: < 1km/dia)
    const effectiveKmPerDay = kmPerDay > 0.1 ? kmPerDay : 1;

    const daysToNextKm = intervalKm / effectiveKmPerDay;

    const kmBasedTargetDate = new Date(currentDate);
    kmBasedTargetDate.setDate(currentDate.getDate() + Math.round(daysToNextKm));

    // Usa a data mais próxima entre a estimada por KM e a fixa por tempo
    targetDate = kmBasedTargetDate < targetDate ? kmBasedTargetDate : targetDate;
  }

  const currentVehicleKm = Math.max(vehicle.current_km || 0, currentOdometer);
  const remainingKm = targetKm - currentVehicleKm;

  return {
    targetKm,
    targetDate,
    remainingKm,
    isAlert: remainingKm < 1000 || new Date() > targetDate
  };
}
