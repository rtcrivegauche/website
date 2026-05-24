import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let post = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    post = data
    
    if (!post) {
      redirect('/admin/blog')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {post ? 'Modifier l\'article' : 'Nouvel article'}
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BlogForm post={post} />
      </div>
    </div>
  )
}
