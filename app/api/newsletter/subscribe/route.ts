import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, email, whatsappNumber } = body

    // 1. Validation de base
    if (!firstName || !email) {
      return NextResponse.json(
        { message: 'Le prénom et l\'adresse email sont requis.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Veuillez fournir une adresse email valide.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 2. Insérer l'abonné en base de données
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        first_name: firstName,
        email: email,
        whatsapp_number: whatsappNumber || null
      }])

    if (error) {
      // Gérer l'erreur d'email en doublon (clé unique)
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Cette adresse email est déjà inscrite à notre newsletter.' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { message: 'Inscription réussie.' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { message: error.message || 'Une erreur serveur est survenue.' },
      { status: 500 }
    )
  }
}
