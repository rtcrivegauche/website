'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DonationModal from '@/components/public/DonationModal'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [donationModalOpen, setDonationModalOpen] = useState(false)
  const pathname = usePathname()
  const [navLinks, setNavLinks] = useState<any[]>([
    { label: 'ACCUEIL', url: '/' },
    { label: 'LE CLUB', url: '/a-propos' },
    { label: 'NOS ACTIONS', url: '/actions' },
    { label: 'ÉVÉNEMENTS', url: '/evenements' },
    { label: 'MEMBRES', url: '/membres' },
    { label: 'PAST-PRÉSIDENTS', url: '/past-presidents' },
    { label: 'ACTUALITÉS', url: '/blog' },
    { label: 'DÉCOUVERTES', url: '/decouvertes' },
  ])
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Écouter les demandes d'ouverture du modal de don depuis n'importe quel bouton de la page
  useEffect(() => {
    const handleOpenModal = () => setDonationModalOpen(true)
    window.addEventListener('open-donation-modal', handleOpenModal)

    if (window.location.hash === '#don' || window.location.hash === '#faire-un-don') {
      setDonationModalOpen(true)
    }

    return () => {
      window.removeEventListener('open-donation-modal', handleOpenModal)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // 1. Charger la config du site (incluant le numéro de téléphone de contact)
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
        // S'assurer que PAST-PRÉSIDENTS est présent même avant la migration SQL manuelle
        const hasPastPresidents = items.some((it: any) => 
          (it?.url || '').includes('past-president') || 
          (it?.label || '').toLowerCase().includes('past-président') ||
          (it?.label || '').toLowerCase().includes('past-president')
        )

        if (!hasPastPresidents) {
          const membresIdx = items.findIndex((it: any) => 
            (it?.label || '').toUpperCase().includes('MEMBRE') || (it?.url || '').includes('membres')
          )
          const pastItem = { 
            id: 'virtual-past-presidents',
            label: 'PAST-PRÉSIDENTS', 
            url: '/past-presidents', 
            display_order: membresIdx >= 0 ? (items[membresIdx]?.display_order || 5) + 0.5 : 5.5,
            is_active: true 
          }
          const updated = [...items]
          if (membresIdx >= 0) {
            updated.splice(membresIdx + 1, 0, pastItem)
          } else {
            updated.push(pastItem)
          }
          setNavLinks(updated)
        } else {
          setNavLinks(items)
        }
      } else {
        // Auto-initialisation si aucun item de navigation n'existe
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
            { label: 'PAST-PRÉSIDENTS', url: '/past-presidents', display_order: 6, is_active: true },
            { label: 'ACTUALITÉS', url: '/blog', display_order: 7, is_active: true },
            { label: 'DÉCOUVERTES', url: '/decouvertes', display_order: 8, is_active: true },
          ]
          
          await supabase.from('navigation').insert(defaultLinks)
          
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

  const isDonationItem = (item: any) => {
    const label = (item?.label || '').toLowerCase().trim()
    const rawUrl = (item?.url || '').trim()
    return label.includes('don') || rawUrl === '#don' || rawUrl === '/don' || rawUrl === '/faire-un-don'
  }

  const getSafeUrl = (item: any) => {
    const rawUrl = (item?.url || '').trim()
    if (!rawUrl || rawUrl === '#' || rawUrl === '/#') {
      return '/'
    }
    return rawUrl
  }

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/'
    }
    if (url.includes('past-president')) {
      return pathname.startsWith('/past-president') || pathname.startsWith('/past-presidents')
    }
    return pathname.startsWith(url)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-gray-100 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-md py-1.5 md:py-2' 
          : 'bg-white/80 backdrop-blur-xl shadow-sm py-3 md:py-4'
      }`}>
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-4 xl:px-6 justify-between items-center gap-3 lg:gap-5 xl:gap-8">
          <Link href="/" className="flex-shrink-0">
            {siteConfig?.site_logo_url ? (
              <img 
                src={siteConfig.site_logo_url} 
                alt={siteConfig.site_name || 'Rotaract Cica'} 
                className={`w-auto object-contain transition-all duration-300 ease-in-out ${
                  isScrolled 
                    ? 'h-11 md:h-12 lg:h-14' 
                    : 'h-14 md:h-16 lg:h-20'
                }`} 
              />
            ) : (
              <div className="text-xl lg:text-2xl font-extrabold text-[#014F43] uppercase tracking-tight">
                {siteConfig?.site_name ? siteConfig.site_name.replace('Club Rotaract de ', 'Rotaract ').replace('Cotonou Rive Gauche ', '') : 'Rotaract Cica'}
              </div>
            )}
          </Link>
          
          <nav className="flex items-center gap-2 md:gap-2.5 lg:gap-3.5 xl:gap-5 2xl:gap-6 flex-1 justify-center min-w-0">
            {navLinks.filter(item => item.type !== 'cta').map((link) => {
              const isDon = isDonationItem(link)
              if (isDon) {
                return (
                  <button
                    key={link.id || link.label}
                    type="button"
                    onClick={() => setDonationModalOpen(true)}
                    className="font-bold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm uppercase tracking-tight lg:tracking-normal transition-all duration-300 whitespace-nowrap text-[#014F43] hover:text-[#E11A60] pb-1 cursor-pointer"
                  >
                    {link.label}
                  </button>
                )
              }

              const url = getSafeUrl(link)
              return (
                <Link
                  key={link.id || link.url || link.label}
                  href={url}
                  className={`font-bold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm uppercase tracking-tight lg:tracking-normal transition-all duration-300 whitespace-nowrap hover:text-[#E11A60] ${
                    isActive(url)
                      ? 'text-[#E11A60] border-b-2 border-[#E11A60] pb-1'
                      : 'text-[#014F43] hover:border-b-2 hover:border-[#E11A60]/50 pb-1'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            {(() => {
              const ctaItems = navLinks.filter(item => item.type === 'cta').slice(0, 2)
              if (ctaItems.length > 0) {
                return ctaItems.map((cta) => {
                  const isDon = isDonationItem(cta)
                  const isBgTransparent = cta.is_transparent || cta.bg_color === 'transparent'
                  const bgColor = isBgTransparent ? 'transparent' : (cta.bg_color || '#E11A60')
                  const textColor = cta.text_color || (isBgTransparent ? '#014F43' : '#FFFFFF')
                  const borderColor = cta.border_color || (isBgTransparent ? '#014F43' : 'transparent')
                  const shape = cta.shape || 'rounded-full'

                  if (isDon) {
                    return (
                      <button
                        key={cta.id || cta.label}
                        type="button"
                        onClick={() => setDonationModalOpen(true)}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                          borderColor: borderColor,
                          borderWidth: '2px',
                          borderStyle: 'solid'
                        }}
                        className={`px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold shadow-md hover:scale-95 transition-all duration-200 whitespace-nowrap text-center cursor-pointer ${shape}`}
                      >
                        {cta.label}
                      </button>
                    )
                  }

                  const targetUrl = getSafeUrl(cta)
                  return (
                    <Link
                      key={cta.id || cta.url || cta.label}
                      href={targetUrl}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: borderColor,
                        borderWidth: '2px',
                        borderStyle: 'solid'
                      }}
                      className={`px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold shadow-md hover:scale-95 transition-all duration-200 whitespace-nowrap text-center ${shape}`}
                    >
                      {cta.label}
                    </Link>
                  )
                })
              }

              // Bouton par défaut si aucun CTA n'est configuré
              return (
                <button
                  type="button"
                  onClick={() => setDonationModalOpen(true)}
                  className="px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold bg-[#E11A60] hover:bg-[#c01550] text-white rounded-full shadow-md hover:scale-95 transition-all duration-200 whitespace-nowrap text-center cursor-pointer"
                >
                  Faire un don
                </button>
              )
            })()}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden px-5 justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            {siteConfig?.site_logo_url ? (
              <img 
                src={siteConfig.site_logo_url} 
                alt={siteConfig.site_name || 'Rotaract Cica'} 
                className={`w-auto object-contain transition-all duration-300 ease-in-out ${
                  isScrolled ? 'h-13' : 'h-18'
                }`} 
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
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border-[1.5px] border-white flex items-center justify-center text-white text-3xl cursor-pointer"
          >
            &times;
          </button>
          
          {navLinks.filter(item => item.type !== 'cta').map((link) => {
            const isDon = isDonationItem(link)
            if (isDon) {
              return (
                <button
                  key={link.id || link.label}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setDonationModalOpen(true)
                  }}
                  className="text-xl font-bold uppercase tracking-wider text-[#E11A60] cursor-pointer"
                >
                  {link.label}
                </button>
              )
            }

            const url = getSafeUrl(link)
            return (
              <Link
                key={link.id || link.url || link.label}
                href={url}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xl font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isActive(url) ? 'text-[#E11A60]' : 'text-white hover:text-[#E11A60]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="w-full max-w-xs flex flex-col gap-3 mt-4">
            {(() => {
              const ctaItems = navLinks.filter(item => item.type === 'cta').slice(0, 2)
              if (ctaItems.length > 0) {
                return ctaItems.map((cta) => {
                  const isDon = isDonationItem(cta)
                  const isBgTransparent = cta.is_transparent || cta.bg_color === 'transparent'
                  const bgColor = isBgTransparent ? 'transparent' : (cta.bg_color || '#E11A60')
                  const textColor = cta.text_color || '#FFFFFF'
                  const borderColor = cta.border_color || (isBgTransparent ? '#FFFFFF' : 'transparent')
                  const shape = cta.shape || 'rounded-full'

                  if (isDon) {
                    return (
                      <button
                        key={cta.id || cta.label}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setDonationModalOpen(true)
                        }}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                          borderColor: borderColor,
                          borderWidth: '2px',
                          borderStyle: 'solid'
                        }}
                        className={`px-8 py-3 text-center font-bold shadow-md text-base w-full cursor-pointer ${shape}`}
                      >
                        {cta.label}
                      </button>
                    )
                  }

                  const targetUrl = getSafeUrl(cta)
                  return (
                    <Link
                      key={cta.id || cta.url || cta.label}
                      href={targetUrl}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: borderColor,
                        borderWidth: '2px',
                        borderStyle: 'solid'
                      }}
                      className={`px-8 py-3 text-center font-bold shadow-md text-base w-full ${shape}`}
                    >
                      {cta.label}
                    </Link>
                  )
                })
              }
              return (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setDonationModalOpen(true)
                  }}
                  className="px-8 py-3 text-center font-bold bg-[#E11A60] text-white rounded-full shadow-md text-base w-full cursor-pointer"
                >
                  Faire un don ❤️
                </button>
              )
            })()}
          </div>
        </div>
      )}

      {/* Modal interactif de Don */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        phone={siteConfig?.contact_phone}
      />
    </>
  )
}
