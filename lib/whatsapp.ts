export function generateMaintenanceMessage(
  clientName: string,
  phone: string,
  vehicleModel: string,
  vehiclePlate: string,
  serviceName: string,
  dueDate: string
) {
  const cleanedPhone = phone.replace(/\D/g, '');

  const message = `Olá, ${clientName}! Passando para lembrar que a manutenção de "${serviceName}" do seu veículo ${vehicleModel} (${vehiclePlate}) está próxima de vencer (data prevista: ${dueDate}). Gostaria de agendar um horário conosco?`;

  // Assuming 55 prefix for Brazil, remove it if it already exists in the phone number
  const formattedPhone = cleanedPhone.startsWith('55') ? cleanedPhone : `55${cleanedPhone}`;

  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
}
