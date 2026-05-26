import { createClient } from '@/lib/supabase/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'Contact',
  description: 'Contactez le Rotaract Club de Cotonou Rive Gauche Cica. Nous serions ravis d\'échanger avec vous.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  
  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={32} />
            <h1 className="text-4xl md:text-5xl font-bold">Contactez-nous</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Une question ? Une suggestion ? Envie de rejoindre le club ? Écrivez-nous !
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#014F43] mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Email */}
            {config?.contact_email && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#014F43]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#014F43]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${config.contact_email}`}
                      className="text-[#014F43] hover:underline"
                    >
                      {config.contact_email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Téléphone */}
            {config?.contact_phone && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E11A60]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#E11A60]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                    <a
                      href={`tel:${config.contact_phone}`}
                      className="text-[#014F43] hover:underline"
                    >
                      {config.contact_phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Adresse */}
            {config?.address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#014F43]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#014F43]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Adresse</h3>
                    <p className="text-gray-600">{config.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Réseaux sociaux */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                {config?.facebook_url && (
                  <a
                    href={config.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#014F43] text-white rounded-full flex items-center justify-center hover:bg-[#00362d] transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    f
                  </a>
                )}
                {config?.instagram_url && (
                  <a
                    href={config.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#E11A60] text-white rounded-full flex items-center justify-center hover:bg-[#c01550] transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    i
                  </a>
                )}
                {config?.linkedin_url && (
                  <a
                    href={config.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#014F43] text-white rounded-full flex items-center justify-center hover:bg-[#00362d] transition-colors"
                  >
                    <span className="sr-only">LinkedIn</span>
                    in
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  )
}
