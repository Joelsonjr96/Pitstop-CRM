import { getServiceTypes } from '@/domain/customers/queries'
import { ServiceRegistrationForm } from '@/components/ServiceRegistrationFormClient'

export default async function RegistrarServicoPage() {
  const serviceTypes = await getServiceTypes()

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Registrar Novo Serviço</h1>
      <ServiceRegistrationForm serviceTypes={serviceTypes} />
    </div>
  )
}
