'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [navLinks, setNavLinks] = useState<any[]>([
    { label: 'ACCUEIL', url: '/' },
    { label: 'LE CLUB', url: '/a-propos' },
    { label: 'NOS ACTIONS', url: '/actions' },
    { label: 'ÉVÉNEMENTS', url: '/evenements' },
    { label: 'MEMBRES', url: '/membres' },
    { label: 'ACTUALITÉS', url: '/blog' },
  ])
  const [siteConfig, setSiteConfig] = useState<any>(null)

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
        .from('navigation')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (items && items.length > 0) {
        setNavLinks(items)
      } else {
        // Auto-initialisation si aucun item de navigation n'existe du tout
        const { data: allItems } = await supabase
          .from('navigation')
          .select('*')
        
        if (!allItems || allItems.length === 0) {
          const defaultLinks = [
            { label: 'ACCUEIL', url: '/', display_order: 1, is_active: true },
            { label: 'LE CLUB', url: '/a-propos', display_order: 2, is_active: true },
            { label: 'NOS ACTIONS', url: '/actions', display_order: 3, is_active: true },
            { label: 'ÉVÉNEMENTS', url: '/evenements', display_order: 4, is_active: true },
            { label: 'MEMBRES', url: '/membres', display_order: 5, is_active: true },
            { label: 'ACTUALITÉS', url: '/blog', display_order: 6, is_active: true },
          ]
          
          await supabase.from('navigation').insert(defaultLinks)
          
          // Re-fetch après insertion
          const { data: newItems } = await supabase
            .from('navigation')
            .select('*')
            .eq('is_active', true)
            .order('display_order')
          if (newItems && newItems.length > 0) {
            setNavLinks(newItems)
          }
        }
      }
    }

    fetchData()
  }, [])

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(url)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-[1320px] mx-auto px-6 py-5 justify-between items-center gap-8">
          <Link href="/" className="flex-shrink-0">
            {siteConfig?.site_logo_url ? (
              <img 
                src={siteConfig.site_logo_url} 
                alt={siteConfig.site_name || 'Rotaract Cica'} 
                className="h-10 w-auto object-contain" 
              />
            ) : (
              <div className="text-2xl font-extrabold text-[#014F43] uppercase tracking-tight">
                {siteConfig?.site_name ? siteConfig.site_name.replace('Club Rotaract de ', 'Rotaract ').replace('Cotonou Rive Gauche ', '') : 'Rotaract Cica'}
              </div>
            )}
          </Link>
          
          <nav className="flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`font-bold text-sm uppercase tracking-wide transition-all duration-300 whitespace-nowrap hover:text-[#E11A60] ${
                  isActive(link.url)
                    ? 'text-[#E11A60] border-b-2 border-[#E11A60] pb-1'
                    : 'text-[#014F43] hover:border-b-2 hover:border-[#E11A60]/50 pb-1'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href={siteConfig?.hero_cta_primary_url || '/membres'}
              className="hidden lg:block px-5 py-2.5 bg-[#E11A60] text-white text-sm font-bold rounded-full hover:scale-95 transition-all duration-200 whitespace-nowrap text-center shadow-md hover:shadow-lg"
            >
              REJOINDRE LE CLUB
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 border-2 border-[#014F43] text-[#014F43] text-sm font-bold rounded-full hover:bg-[#014F43] hover:text-white transition-all duration-300 whitespace-nowrap text-center"
            >
              CONTACT
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden px-5 py-4 justify-between items-center">
          <Link href="/">
            {siteConfig?.site_logo_url ? (
              <img 
                src={siteConfig.site_logo_url} 
                alt={siteConfig.site_name || 'Rotaract Cica'} 
                className="h-9 w-auto object-contain" 
              />
            ) : (
              <div className="text-[20px] font-extrabold text-[#014F43] uppercase tracking-tight">
                {siteConfig?.site_name ? siteConfig.site_name.replace('Club Rotaract de ', 'Rotaract ').replace('Cotonou Rive Gauche ', '') : 'Rotaract Cica'}
              </div>
            )}
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="w-11 h-11 rounded-full bg-white/90 border-[1.5px] border-[#00362d] flex flex-col items-center justify-center gap-1 hover:bg-[#00362d] group transition-all"
          >
            <span className="h-0.5 w-[18px] bg-[#00362d] rounded group-hover:bg-white transition-colors"></span>
            <span className="h-0.5 w-[14px] bg-[#00362d] rounded group-hover:bg-white transition-colors"></span>
            <span className="h-0.5 w-5 bg-[#00362d] rounded group-hover:bg-white transition-colors"></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 w-full h-screen bg-[#00362d]/98 z-[100] flex flex-col items-center justify-center gap-8 p-6 overflow-y-auto">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border-[1.5px] border-white flex items-center justify-center text-white text-3xl"
          >
            &times;
          </button>
          
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xl font-bold uppercase tracking-wider transition-colors duration-300 ${
                isActive(link.url) ? 'text-[#E11A60]' : 'text-white hover:text-[#E11A60]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            href={siteConfig?.hero_cta_primary_url || '/membres'}
            onClick={() => setMobileMenuOpen(false)}
            className="px-8 py-3 bg-white text-[#014F43] rounded-full font-bold mt-4 text-center w-full max-w-xs shadow-md hover:bg-gray-100"
          >
            REJOINDRE LE CLUB
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="px-8 py-3 border-2 border-white text-white rounded-full font-bold text-center w-full max-w-xs hover:bg-white/10"
          >
            CONTACT
          </Link>
        </div>
      )}
    </>
  )
}
