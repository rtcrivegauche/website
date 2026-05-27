export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_config: {
        Row: {
          id: string
          site_name: string
          site_description: string | null
          site_logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_address: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          google_analytics_id: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['site_config']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_config']['Insert']>
      }
      members: {
        Row: {
          id: string
          full_name: string
          slug: string
          photo_url: string | null
          position: string | null
          bio: string | null
          email: string | null
          phone: string | null
          linkedin_url: string | null
          join_date: string | null
          is_active: boolean
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          event_date: string
          event_end_date: string | null
          location: string | null
          location_address: string | null
          featured_image_url: string | null
          speaker_name: string | null
          speaker_photo_url: string | null
          speaker_title: string | null
          speaker_bio: string | null
          is_featured: boolean
          is_published: boolean
          category: string | null
          max_attendees: number | null
          registration_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      actions: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          content: string | null
          featured_image_url: string | null
          category: string
          start_date: string | null
          end_date: string | null
          location: string | null
          beneficiaries_count: number | null
          budget: number | null
          partners: string[] | null
          is_featured: boolean
          is_published: boolean
          display_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['actions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['actions']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          category: string | null
          tags: string[] | null
          author_id: string | null
          is_published: boolean
          published_at: string | null
          views_count: number
          reading_time: number | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      gallery: {
        Row: {
          id: string
          title: string
          description: string | null
          media_url: string
          media_type: string
          thumbnail_url: string | null
          category: string | null
          event_id: string | null
          action_id: string | null
          is_featured: boolean
          display_order: number
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>
      }
      navigation: {
        Row: {
          id: string
          label: string
          url: string
          parent_id: string | null
          display_order: number
          is_active: boolean
          target: string
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['navigation']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['navigation']['Insert']>
      }
      homepage_sections: {
        Row: {
          id: string
          section_name: string
          is_visible: boolean
          display_order: number
          config: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['homepage_sections']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['homepage_sections']['Insert']>
      }
      reports: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          content: string | null
          pdf_url: string | null
          meeting_date: string
          is_published: boolean
          views_count: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
      newsletter_subscribers: {
        Row: {
          id: string
          first_name: string
          email: string
          whatsapp_number: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          promotion: string | null
          quote: string
          avatar_url: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
