import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, firstName, lastName, username } = body

    console.log('Attempting to create profile for:', { userId, firstName, lastName, username })

    // Create a Supabase client with the service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        username: username,
      })
      .select()

    if (error) {
      console.error('Error creating profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Profile created successfully:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Error in create-profile route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 