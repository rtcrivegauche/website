import PresidentForm from '@/components/admin/PresidentForm'

export const metadata = {
  title: 'Nouveau Président - Administration',
}

export default function NewPresidentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
        Nouveau Président de Mandat
      </h1>
      <PresidentForm president={null} />
    </div>
  )
}
