import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Users, Target, Heart, Award } from 'lucide-react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'À propos',
  description: 'Découvrez le Rotaract Club de Cotonou Rive Gauche Cica, notre histoire, nos valeurs et notre impact dans la communauté.',
}

export default async function AProposPage() {
  const supabase = await createClient()
  
  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de nous</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {config?.tagline || 'Servir, Inspirer, Grandir Ensemble'}
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#014F43] mb-6">Notre Histoire</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Le Rotaract Club de Cotonou Rive Gauche Cica est un club de jeunes leaders engagés 
              dans le service communautaire et le développement professionnel. Fondé en [année], 
              notre club fait partie du réseau mondial Rotaract, parrainé par le Rotary International.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depuis notre création, nous avons mené plus de [nombre] actions de service, 
              touché [nombre] bénéficiaires et formé des dizaines de jeunes leaders qui font 
              aujourd&apos;hui la différence dans notre communauté.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notre nom &quot;Cica&quot; symbolise notre engagement envers l&apos;excellence et notre volonté 
              de créer un impact durable dans la société béninoise.
            </p>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="max-w-[1320px] mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-[#014F43] mb-8 text-center">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-[#014F43]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-[#014F43]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Service</h3>
            <p className="text-gray-600">
              Nous plaçons le service aux autres au cœur de nos actions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-[#E11A60]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-[#E11A60]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fraternité</h3>
            <p className="text-gray-600">
              Nous cultivons l&apos;esprit d&apos;équipe et le soutien mutuel
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-[#014F43]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-[#014F43]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
            <p className="text-gray-600">
              Nous visons l&apos;excellence dans tout ce que nous entreprenons
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-[#E11A60]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-[#E11A60]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership</h3>
            <p className="text-gray-600">
              Nous formons les leaders de demain par l&apos;action
            </p>
          </div>
        </div>
      </section>

      {/* Nos axes de service */}
      <section className="bg-white py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#014F43] mb-8 text-center">Nos Axes de Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-[#014F43] pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Développement Professionnel</h3>
              <p className="text-gray-600">
                Formations, mentorat, networking pour développer les compétences de nos membres
              </p>
            </div>

            <div className="border-l-4 border-[#E11A60] pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Service Communautaire</h3>
              <p className="text-gray-600">
                Actions concrètes pour améliorer la vie dans notre communauté
              </p>
            </div>

            <div className="border-l-4 border-[#014F43] pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Développement International</h3>
              <p className="text-gray-600">
                Projets et échanges avec d&apos;autres clubs Rotaract dans le monde
              </p>
            </div>

            <div className="border-l-4 border-[#E11A60] pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Développement du Club</h3>
              <p className="text-gray-600">
                Renforcement de notre organisation et recrutement de nouveaux membres
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
