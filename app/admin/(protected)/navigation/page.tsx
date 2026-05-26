import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Menu } from 'lucide-react'
import NavigationList from '@/components/admin/NavigationList'

export default async function NavigationPage() {
  const supabase = await createClient()
  
  let { data: items } = await supabase
    .from('navigation')
    .select('*')
    .order('order_index')

  // Auto-initialisation si la table est vide
  if (!items || items.length === 0) {
    const defaultLinks = [
      { label: 'ACCUEIL', url: '/', order_index: 1, is_active: true },
      { label: 'LE CLUB', url: '/a-propos', order_index: 2, is_active: true },
      { label: 'NOS ACTIONS', url: '/actions', order_index: 3, is_active: true },
      { label: 'ÉVÉNEMENTS', url: '/evenements', order_index: 4, is_active: true },
      { label: 'MEMBRES', url: '/membres', order_index: 5, is_active: true },
      { label: 'ACTUALITÉS', url: '/blog', order_index: 6, is_active: true },
    ]

    const { data: inserted, error } = await supabase
      .from('navigation')
      .insert(defaultLinks)
      .select()

    if (!error && inserted) {
      items = inserted
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
          <p className="text-gray-600 mt-2">
            Gérez les menus de navigation du site
          </p>
        </div>
        <Link
          href="/admin/navigation/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter un lien
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Menu principal</h2>
        
        {!items || items.length === 0 ? (
          <div className="text-center py-12">
            <Menu size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Aucun lien de navigation</p>
            <Link
              href="/admin/navigation/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
            >
              <Plus size={20} />
              Ajouter votre premier lien
            </Link>
          </div>
        ) : (
          <NavigationList initialItems={items} />
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> La navigation est maintenant entièrement dynamique et gérée depuis cette page.
          Vous pouvez réordonner les liens grâce aux flèches de direction ou modifier les liens individuellement.
        </p>
      </div>
    </div>
  )
}
