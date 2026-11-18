import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import DonationExperience from '@/components/public/DonationExperience'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Faire un don | Club Rotaract de Cotonou Rive Gauche Cica',
  description: 'Soutenez nos actions solidaires au Bénin. Paiement simple par MTN Mobile Money, Moov Flooz, Celtiis Cash ou Virement Bancaire.',
}

export default async function FaireUnDonPage() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single()

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-12 md:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <DonationExperience config={config || {}} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
