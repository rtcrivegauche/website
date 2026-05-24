import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Mail, Phone, Award } from 'lucide-react'
import type { Metadata } from 'next'

interface MemberPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!member) {
    return {
      title: 'Membre introuvable'
    }
  }

  return {
    title: `${member.full_name} | Rotaract Cica`,
    description: member.bio || `Profil de ${member.full_name}, membre du Rotaract Club de Cotonou Rive Gauche Cica`,
  }
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!member) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              {member.photo_url ? (
                <Image
                  src={member.photo_url}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-6xl text-gray-500">
                    {member.full_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {member.full_name}
              </h1>
              
              {member.role_title && (
                <p className="text-xl text-[#E11A60] font-semibold mb-2">
                  {member.role_title}
                </p>
              )}

              {member.professional_title && (
                <p className="text-lg text-white/90 mb-4">
                  {member.professional_title}
                  {member.company && ` chez ${member.company}`}
                </p>
              )}

              {member.commission && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-4">
                  <Award size={16} />
                  {member.commission}
                </div>
              )}

              {/* Contacts */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6">
                {member.show_email && member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#014F43] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Mail size={18} />
                    <span className="hidden md:inline">Email</span>
                  </a>
                )}

                {member.show_phone && member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#014F43] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Phone size={18} />
                    <span className="hidden md:inline">Téléphone</span>
                  </a>
                )}

                {member.show_socials && member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#014F43] rounded-lg hover:bg-gray-100 transition-colors"
                    title="LinkedIn"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}

                {member.show_socials && member.facebook_url && (
                  <a
                    href={member.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#014F43] rounded-lg hover:bg-gray-100 transition-colors"
                    title="Facebook"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {member.show_socials && member.instagram_url && (
                  <a
                    href={member.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#014F43] rounded-lg hover:bg-gray-100 transition-colors"
                    title="Instagram"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biographie */}
            {member.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#014F43] mb-4">
                  À propos
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Compétences */}
            {member.skills && member.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#014F43] mb-4">
                  Compétences
                </h2>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#014F43]/10 text-[#014F43] rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#014F43] mb-4">
                Informations
              </h3>
              <div className="space-y-3 text-sm">
                {member.professional_classification && (
                  <div>
                    <p className="text-gray-500">Classification</p>
                    <p className="font-medium text-gray-900">
                      {member.professional_classification}
                    </p>
                  </div>
                )}

                {member.company && (
                  <div>
                    <p className="text-gray-500">Entreprise</p>
                    <p className="font-medium text-gray-900">
                      {member.company}
                    </p>
                  </div>
                )}

                {member.join_date && (
                  <div>
                    <p className="text-gray-500">Membre depuis</p>
                    <p className="font-medium text-gray-900">
                      {new Date(member.join_date).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {member.status && (
                  <div>
                    <p className="text-gray-500">Statut</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {member.status === 'active' && 'Actif'}
                      {member.status === 'alumni' && 'Alumni'}
                      {member.status === 'board' && 'Bureau'}
                      {member.status === 'guest' && 'Invité'}
                      {member.status === 'partner' && 'Partenaire'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
