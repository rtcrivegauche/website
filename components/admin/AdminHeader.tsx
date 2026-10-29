'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Menu } from 'lucide-react'
import { useAdmin } from '@/components/admin/AdminContext'

export default function AdminHeader({ user }: { user: User }) {
  const router = useRouter()
  const { toggleSidebar } = useAdmin()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sticky top-0 z-30 shadow-sm w-full max-w-full">
      <div className="flex items-center justify-between gap-3 max-w-full">
        {/* Partie gauche : Bouton hamburger mobile + Titre */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden p-2 bg-[#014F43] hover:bg-[#00362d] text-white rounded-lg shadow-sm transition flex items-center justify-center shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            Administration
          </h2>
        </div>

        {/* Partie droite : Infos utilisateur & Bouton Déconnexion */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[180px] md:max-w-[240px]">
              {user.email}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
              Administrateur
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}

