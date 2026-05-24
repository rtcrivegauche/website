import CustomPageForm from '@/components/admin/CustomPageForm'

export default function NewCustomPagePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer une page personnalisée</h1>
        <p className="text-gray-600 mt-2">
          Créez une page avec du contenu personnalisé ou intégrez un formulaire externe (Tally, Google Forms, etc.)
        </p>
      </div>

      <CustomPageForm />
    </div>
  )
}
