import { createClient } from '@/lib/supabase/server'
import TestimonialForm from '@/components/admin/TestimonialForm'

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditTestimonialPageProps) {
  const { id } = await params
  return {
    title: id === 'nouveau' ? 'Nouveau Témoignage - Administration' : 'Modifier le Témoignage - Administration'
  }
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  let testimonial = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
    
    testimonial = data
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
        {testimonial ? 'Modifier le témoignage' : 'Nouveau témoignage d\'un membre / invité'}
      </h1>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
