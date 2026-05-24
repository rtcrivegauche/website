import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

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

  // Récupérer le rôle et les permissions de l'utilisateur connecté
  const { data: userRole } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles (
        id,
        name,
        permissions
      )
    `)
    .eq('user_id', user.id)
    .maybeSingle() // maybeSingle évite de lever une exception si aucun enregistrement n'existe

  // Résoudre le typage si la relation roles est renvoyée sous forme de tableau par le client auto-généré
  const roleData = Array.isArray(userRole?.roles)
    ? userRole.roles[0]
    : (userRole?.roles as any)

  // Si l'utilisateur est connecté à l'admin mais n'a pas d'entrée dans user_roles,
  // on lui accorde tous les accès par sécurité (Super Admin de secours) pour éviter tout blocage.
  const isSuperAdmin = roleData?.name === 'admin' || !userRole
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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar permissions={permissions} isSuperAdmin={isSuperAdmin} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 md:p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
