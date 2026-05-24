'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
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
  Twitter: (props: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  )
}

export default function Footer() {
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [navLinks, setNavLinks] = useState<any[]>([
    { label: 'Accueil', url: '/' },
    { label: 'À propos', url: '/a-propos' },
    { label: 'Nos Actions', url: '/actions' },
    { label: 'Événements', url: '/evenements' },
    { label: 'Membres', url: '/membres' },
    { label: 'Blog', url: '/blog' },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // 1. Charger la config du site
      const { data: config } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (config) {
        setSiteConfig(config)
      }

      // 2. Charger les items de navigation
      const { data: items } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (items && items.length > 0) {
        setNavLinks(items)
      }
    }

    fetchData()
  }, [])

  const socialLinks = [
    { name: 'Facebook', icon: socialIcons.Facebook, href: siteConfig?.social_facebook },
    { name: 'Instagram', icon: socialIcons.Instagram, href: siteConfig?.social_instagram },
    { name: 'LinkedIn', icon: socialIcons.LinkedIn, href: siteConfig?.social_linkedin },
    { name: 'Twitter', icon: socialIcons.Twitter, href: siteConfig?.social_twitter },
  ].filter(link => link.href)

  // S'il n'y a aucun réseau social configuré, on affiche des liens de base par défaut
  const socialLinksToRender = socialLinks.length > 0 ? socialLinks : [
    { name: 'Facebook', icon: socialIcons.Facebook, href: 'https://facebook.com/rotaractcica' },
    { name: 'Instagram', icon: socialIcons.Instagram, href: 'https://instagram.com/rotaractcica' },
    { name: 'LinkedIn', icon: socialIcons.LinkedIn, href: 'https://linkedin.com/company/rotaractcica' },
  ]

  return (
    <footer className="w-full py-12 md:py-16 px-6 bg-gray-100 rounded-t-3xl mt-12 md:mt-16 border-t border-gray-200">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* À propos */}
          <div className="md:col-span-2">
            <div className="mb-4">
              {siteConfig?.footer_logo_url || siteConfig?.site_logo_url ? (
                <img 
                  src={siteConfig.footer_logo_url || siteConfig.site_logo_url} 
                  alt={siteConfig.site_name || 'Rotaract Cica'} 
                  className="h-12 w-auto object-contain mb-4" 
                />
              ) : (
                <h3 className="text-2xl font-bold text-[#014F43]">
                  {siteConfig?.site_name ? siteConfig.site_name.replace('Club Rotaract de ', 'Rotaract ').replace('Cotonou Rive Gauche ', '') : 'Rotaract Cica'}
                </h3>
              )}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base max-w-md">
              {siteConfig?.site_description || "Le Club Rotaract de Cotonou Rive Gauche Cica forme une nouvelle génération de leaders engagés pour un impact durable au Bénin à travers le service, le leadership et l'amitié."}
            </p>
            <div className="flex gap-4">
              {socialLinksToRender.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#014F43] text-white flex items-center justify-center hover:bg-[#E11A60] hover:scale-105 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon strokeWidth={2} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-bold text-[#014F43] mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-gray-600 hover:text-[#E11A60] transition-colors text-sm font-medium uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-[#014F43] mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#E11A60] flex-shrink-0" />
                <a href={`mailto:${siteConfig?.contact_email || 'contact@rotaractcica.org'}`} className="hover:text-[#E11A60] transition-colors">
                  {siteConfig?.contact_email || 'contact@rotaractcica.org'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#E11A60] flex-shrink-0" />
                <a href={`tel:${siteConfig?.contact_phone || '+229'}`} className="hover:text-[#E11A60] transition-colors">
                  {siteConfig?.contact_phone || '+229 XX XX XX XX'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#E11A60] flex-shrink-0" />
                <span>{siteConfig?.contact_address || 'Cotonou, Bénin'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300/50 pt-8 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} {siteConfig?.site_name || 'Club Rotaract de Cotonou Rive Gauche Cica'}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
