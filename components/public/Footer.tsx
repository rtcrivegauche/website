'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Icônes SVG en dur pour une compatibilité absolue sans import lucide-react fragile
const socialIcons = {
  Facebook: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  Instagram: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  LinkedIn: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  TikTok: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  ),
  WhatsApp: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  )
}

export default function Footer() {
  const [siteConfig, setSiteConfig] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: config } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (config) {
        setSiteConfig(config)
      }
    }

    fetchData()
  }, [])

  // Liens des réseaux sociaux officiels et cliquables
  const socialLinks = [
    { name: 'Facebook', icon: socialIcons.Facebook, href: 'https://www.facebook.com/rivegauchecica' },
    { name: 'Instagram', icon: socialIcons.Instagram, href: 'https://www.instagram.com/rtcrivegauchecica' },
    { name: 'TikTok', icon: socialIcons.TikTok, href: 'https://shorturl.at/0C00J' },
    { name: 'WhatsApp', icon: socialIcons.WhatsApp, href: 'https://whatsapp.com/channel/0029Va8P87mIyPtJ1Nl7p93J' }
  ]

  // Liens utiles enrichis
  const usefulLinks = [
    { label: 'Notre Vision', url: '/a-propos' },
    { label: 'Nos Actions', url: '/actions' },
    { label: 'Événements', url: '/evenements' },
    { label: 'Actualités', url: '/blog' },
    { label: 'Devenir Membre', url: '/p/rejoindre-le-club' },
    { label: 'Faire un Don', url: '/p/faire-un-don' },
    { label: 'Plan du Site', url: '/sitemap.xml' },
    { label: 'Contact', url: '/contact' }
  ]

  return (
    <footer className="w-full py-16 px-6 bg-gray-900 text-gray-300 rounded-t-[40px] mt-16 border-t border-gray-800">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div>
              {siteConfig?.footer_logo_url || siteConfig?.site_logo_url ? (
                <img 
                  src={siteConfig.footer_logo_url || siteConfig.site_logo_url} 
                  alt="Club Rotaract de Cotonou Rive Gauche Cica" 
                  className="h-28 lg:h-36 w-auto object-contain mb-3 mx-auto lg:mx-0" 
                />
              ) : (
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-1">
                  Club Rotaract de Cotonou Rive Gauche Cica
                </h3>
              )}

            </div>
            
            <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-md mx-auto lg:mx-0">
              {siteConfig?.site_description || "Nous formons une nouvelle génération de leaders et de professionnels engagés à travers le service, l'amitié et l'action humanitaire au Bénin."}
            </p>

            {/* Réseaux Sociaux */}
            <div className="flex justify-center lg:justify-start gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#E11A60] hover:scale-105 transition-all duration-300 border border-gray-700"
                    aria-label={social.name}
                  >
                    <Icon strokeWidth={2} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Liens Rapides / Utiles */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-center lg:text-left">Liens rapides</h4>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
              {usefulLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-semibold flex items-center justify-start lg:justify-start gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#E11A60] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Officiel sous forme de boutons */}
          <div>
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-center lg:text-left">Contact</h4>
            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto lg:mx-0">
              {/* Bouton Appel */}
              <a 
                href={`tel:${siteConfig?.contact_phone || '+22997000000'}`} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-[#E11A60] hover:bg-gray-800 text-white hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="p-2 rounded-lg bg-gray-900 group-hover:bg-[#E11A60] text-[#E11A60] group-hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Téléphone (Appel direct)</span>
                  <span className="block text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {siteConfig?.contact_phone || '+229 XX XX XX XX'}
                  </span>
                </div>
              </a>

              {/* Bouton WhatsApp */}
              <a 
                href={`https://wa.me/${(siteConfig?.contact_phone || '+22997000000').replace(/[^0-9]/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-emerald-500 hover:bg-gray-800 text-white hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="p-2 rounded-lg bg-gray-900 group-hover:bg-emerald-500 text-emerald-500 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                  {socialIcons.WhatsApp({ className: "w-4 h-4" })}
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">WhatsApp</span>
                  <span className="block text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    Démarrer une discussion
                  </span>
                </div>
              </a>

              {/* Bouton Email */}
              <a 
                href="mailto:rtcctnrivegauchecica@gmail.com" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-[#E11A60] hover:bg-gray-800 text-white hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="p-2 rounded-lg bg-gray-900 group-hover:bg-[#E11A60] text-[#E11A60] group-hover:text-white transition-colors duration-300">
                  <Mail size={16} />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Email Officiel</span>
                  <span className="block text-xs font-semibold break-all text-gray-300 group-hover:text-white transition-colors">
                    rtcctnrivegauchecica@gmail.com
                  </span>
                </div>
              </a>

              {/* Bouton Localisation */}
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig?.contact_address || 'Cotonou, Bénin')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-blue-500 hover:bg-gray-800 text-white hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="p-2 rounded-lg bg-gray-900 group-hover:bg-blue-500 text-blue-500 group-hover:text-white transition-colors duration-300">
                  <MapPin size={16} />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Adresse & Localisation</span>
                  <span className="block text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {siteConfig?.contact_address || 'Cotonou, Bénin'}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Liens Légaux */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-semibold">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Club Rotaract de Cotonou Rive Gauche Cica. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/p/politique-confidentialite" className="hover:text-white transition-colors flex items-center gap-1">
              Politique de Confidentialité <ExternalLink size={12} />
            </Link>
            <Link href="/p/mentions-legales" className="hover:text-white transition-colors flex items-center gap-1">
              Mentions Légales <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
