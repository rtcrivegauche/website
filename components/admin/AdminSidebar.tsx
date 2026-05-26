'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Target, 
  FileText, 
  Image, 
  FileCode, 
  Menu as MenuIcon, 
  Settings,
  Home,
  Shield,
  UserCog,
  FolderOpen,
  Mail,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  permissions?: Record<string, boolean>
  isSuperAdmin?: boolean
}

const menuSectionsRaw = [
  {
    title: 'Principal',
    items: [
      { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, permissionKey: 'menu_dashboard' },
      { label: 'Page d\'accueil', href: '/admin/home', icon: Home, permissionKey: 'menu_home' },
    ]
  },
  {
    title: 'Contenu',
    items: [
      { label: 'Membres', href: '/admin/membres', icon: Users, permissionKey: 'menu_membres' },
      { label: 'Événements', href: '/admin/evenements', icon: Calendar, permissionKey: 'menu_evenements' },
      { label: 'Actions', href: '/admin/actions', icon: Target, permissionKey: 'menu_actions' },
      { label: 'Blog', href: '/admin/blog', icon: FileText, permissionKey: 'menu_blog' },
      { label: 'Galerie', href: '/admin/galerie', icon: Image, permissionKey: 'menu_galerie' },
    ]
  },
  {
    title: 'Site Web',
    items: [
      { label: 'Pages personnalisées', href: '/admin/pages', icon: FileCode, permissionKey: 'menu_pages' },
      { label: 'Navigation', href: '/admin/navigation', icon: MenuIcon, permissionKey: 'menu_navigation' },
      { label: 'Médias', href: '/admin/media', icon: FolderOpen, permissionKey: 'menu_media' },
      { label: 'Messages', href: '/admin/messages', icon: Mail, permissionKey: 'menu_messages' },
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'Utilisateurs', href: '/admin/users', icon: UserCog, permissionKey: 'menu_users' },
      { label: 'Rôles', href: '/admin/roles', icon: Shield, permissionKey: 'menu_roles' },
      { label: 'Configuration', href: '/admin/config', icon: Settings, permissionKey: 'menu_config' },
    ]
  },
]

export default function AdminSidebar({ permissions = {}, isSuperAdmin = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filtrer les menus en fonction des permissions de l'utilisateur
  const filteredSections = menuSectionsRaw.map(section => {
    const items = section.items.filter(item => {
      // Les super admins ont tous les droits
      if (isSuperAdmin) return true
      // Sinon, vérifier si la permission est activée dans l'objet JSONB
      return permissions[item.permissionKey] === true
    })

    return {
      ...section,
      items
    }
  }).filter(section => section.items.length > 0) // Masquer les sections vides

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#014F43] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#014F43] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Rotaract Cica</h1>
          <p className="text-sm text-white/70">Dashboard Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                        isActive
                          ? 'bg-[#E11A60] text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          {filteredSections.length === 0 && (
            <p className="text-sm text-white/50 italic px-4 py-8 text-center">
              Aucun menu d'administration autorisé pour votre compte.
            </p>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Voir le site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
