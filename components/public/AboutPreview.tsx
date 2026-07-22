'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { HandHeart, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const iconMap = {
  HandHeart,
  TrendingUp,
  Users,
}

type ValueItem = {
  iconName: keyof typeof iconMap
  title: string
  description: string
  color: string
}

export default function AboutPreview() {
  const [aboutImage, setAboutImage] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuC96fb1noioaBH_jJfnvyvIsRATmdaiqwUXuS7I8qarEGz4QmrlDaJAueRbzzgX1XSkA5YIki1N80mE5kS7FfRehofQarKjin6Kk3gh8sY4Xfk2oSAC_4cKj8eMRdapsCvWLGCTrWvAzg95hVc2esCXF-nAd9NsfhJN6UUXYDzAcMKoAtWRn0joe89Eh0yyVnt4EO_8vNwnihhTE9lel4789bljUXBhsQkIggOnysf4xVfvxXWWugNxdV2B38X81HpNSBLTzQUN8SQ")
  const [badgeNumber, setBadgeNumber] = useState<string>("98%")
  const [badgeText, setBadgeText] = useState<string>("Satisfaction des membres dans nos projets communautaires.")

  useEffect(() => {
    async function loadAboutData() {
      try {
        const supabase = createClient()
        const { data: config } = await supabase
          .from('site_config')
          .select('about_image_url, about_badge_number, about_badge_text')
          .limit(1)
          .maybeSingle()

        if (config) {
          if (config.about_image_url) setAboutImage(config.about_image_url)
          if (config.about_badge_number) setBadgeNumber(config.about_badge_number)
          if (config.about_badge_text) setBadgeText(config.about_badge_text)
        }
      } catch (e) {
        console.error('Erreur chargement données À Propos:', e)
      }
    }
    loadAboutData()
  }, [])

  const values: ValueItem[] = [
    {
      iconName: 'HandHeart',
      title: 'Service',
      description: 'Nous mettons nos compétences au profit de la communauté à travers des actions concrètes et durables.',
      color: 'bg-[#014F43]',
    },
    {
      iconName: 'TrendingUp',
      title: 'Leadership',
      description: 'Un terrain d\'apprentissage unique pour développer ses capacités de gestion, de prise de parole et de stratégie.',
      color: 'bg-[#E11A60]',
    },
    {
      iconName: 'Users',
      title: 'Amitié',
      description: 'Plus qu\'un club, une famille unie par des valeurs fortes et des moments de partage inoubliables.',
      color: 'bg-[#E11A60]',
    },
  ]

  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
      {/* Image */}
      <div className="relative">
        <Image
          src={aboutImage}
          alt="Membres Rotaract"
          width={600}
          height={750}
          className="w-full aspect-[4/5] object-cover rounded-xl shadow-lg"
        />
        <div className="absolute -bottom-10 -right-10 hidden lg:block w-64 h-64 bg-[#E11A60] rounded-xl p-8 shadow-xl text-white">
          <span className="text-5xl font-bold">{badgeNumber}</span>
          <p className="text-sm mt-4">
            {badgeText}
          </p>
        </div>
      </div>

      {/* Values Cards - Desktop */}
      <div className="hidden md:flex flex-col gap-6">
        {values.map((value, index) => {
          const Icon = iconMap[value.iconName]
          return (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${value.color} flex items-center justify-center text-white`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-[#014F43]">{value.title}</h3>
              </div>
              <p className="text-gray-600">{value.description}</p>
            </div>
          )
        })}
      </div>

      {/* Values Cards - Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {values.map((value, index) => {
          const Icon = iconMap[value.iconName]
          return (
            <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
              <div className={`w-10 h-10 rounded-full ${value.color} flex items-center justify-center text-white flex-shrink-0`}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#014F43]">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
