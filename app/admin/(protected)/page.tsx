import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const [membersCount, eventsCount, actionsCount, postsCount] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('actions').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Membres', value: membersCount.count || 0, color: 'bg-blue-500' },
    { label: 'Événements', value: eventsCount.count || 0, color: 'bg-green-500' },
    { label: 'Actions', value: actionsCount.count || 0, color: 'bg-purple-500' },
    { label: 'Articles', value: postsCount.count || 0, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Bienvenue dans le dashboard
        </h2>
        <p className="text-gray-600">
          Gérez tous les contenus de votre site Rotaract depuis cette interface.
        </p>
      </div>
    </div>
  )
}
