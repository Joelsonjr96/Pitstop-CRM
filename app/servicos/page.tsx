import { createClient } from '@/lib/supabase/server'
import { ServiceTypeDialog } from '@/components/ServiceTypeDialog'
import { Wrench } from "lucide-react"

export default async function ServicosPage() {
  const supabase = await createClient()

  const { data: serviceTypes } = await supabase
    .from('service_types')
    .select('*')
    .order('name')

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <ServiceTypeDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {serviceTypes?.map((st) => (
          <div key={st.id} className="border border-zinc-800 rounded-xl p-6 bg-card flex flex-col justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 p-3 bg-zinc-800/50 rounded-br-lg border-r border-b border-zinc-800">
                <Wrench className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4 text-foreground">{st.name}</h3>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                    🛣️ {st.interval_km.toLocaleString('pt-BR')} km
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                    📅 {st.interval_months} meses
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <ServiceTypeDialog serviceType={st} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
