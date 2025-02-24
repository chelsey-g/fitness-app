import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const captchaToken = String(formData.get('captchaToken'))

  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
