import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import PwaInstallPrompt from '@/components/ui/PwaInstallPrompt'
import { AdminProvider } from '@/components/admin/AdminContext'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Récupérer le rôle, les permissions et le statut d'activité de l'utilisateur connecté
  const { data: profile } = await supabase
    .from('users')
    .select(`
      is_active,
      roles (
        id,
        name,
        permissions
      )
    `)
    .eq('id', user.id)
    .maybeSingle()

  // Si l'utilisateur a été désactivé, le déconnecter et le rediriger vers la connexion
  if (profile && profile.is_active === false) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=compte_desactive')
  }

  const roleData = Array.isArray(profile?.roles)
    ? profile.roles[0]
    : (profile?.roles as any)

  // Si l'utilisateur a le rôle admin, c'est le Super Admin
  const isSuperAdmin = roleData?.name === 'admin'
  const permissions = roleData?.permissions || (isSuperAdmin ? {
    menu_dashboard: true,
    menu_home: true,
    menu_membres: true,
    menu_evenements: true,
    menu_actions: true,
    menu_blog: true,
    menu_galerie: true,
    menu_pages: true,
    menu_navigation: true,
    menu_media: true,
    menu_users: true,
    menu_roles: true,
    menu_config: true
  } : {})

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50 flex w-full max-w-full overflow-x-hidden">
        <AdminSidebar permissions={permissions} isSuperAdmin={isSuperAdmin} />
        <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
          <AdminHeader user={user} />
          <main className="flex-1 p-3 sm:p-5 md:p-6 min-w-0 max-w-full">
            <PwaInstallPrompt />
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}

