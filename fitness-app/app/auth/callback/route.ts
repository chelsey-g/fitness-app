import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

  if (code) {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`)
}

// import { NextResponse } from "next/server"
// import { cookies } from "next/headers"
// import { createClient } from "@/utils/supabase/server"

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the Auth Helpers package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get("code")
//   const origin = requestUrl.origin
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

//   if (code) {
//     const cookieStore = cookies()
//     const supabase = createClient(cookieStore)
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   if (redirectTo) {
//     return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`)
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/dashboard`)

// // URL to redirect to after sign in process completes
// return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
// }

// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the Auth Helpers package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get("code")
//   const next = requestUrl.searchParams.get("next")
//   const redirectTo = requestUrl.searchParams.get("redirectTo")
//   const competitionId = requestUrl.searchParams.get("competitionId")

//   console.log('Callback received with:', {
//     hasCode: !!code,
//     redirectTo,
//     competitionId,
//     fullUrl: request.url
//   })

//   if (code) {
//     const supabase = createRouteHandlerClient({ cookies })

//     try {
//       // Exchange code for session
//       await supabase.auth.exchangeCodeForSession(code)

//       console.log('Session exchange result:', {
//         hasSession: !!supabase.auth.getUser(),
//         userId: supabase.auth.getUser().data.user?.id,
//         userEmail: supabase.auth.getUser().data.user?.user_metadata.email,
//         error: null
//       })

//       if (supabase.auth.getUser().data.user && competitionId) {
//         const numericCompetitionId = parseInt(competitionId)

//         if (isNaN(numericCompetitionId)) {
//           console.error('Invalid competition ID:', competitionId)
//           return
//         }

//         // First check if they're already in the competition
//         const { data: existingPlayer, error: checkError } = await supabase
//           .from('competitions_players')
//           .select()
//           .eq('competition_id', numericCompetitionId)
//           .eq('player_id', supabase.auth.getUser().data.user.id)
//           .single()

//         console.log('Checking existing player:', {
//           exists: !!existingPlayer,
//           checkError: checkError?.message
//         })

//         if (existingPlayer) {
//           console.log('User already in competition')
//         } else {
//           // Add user to competition
//           console.log('Attempting to add player:', {
//             competition_id: numericCompetitionId,
//             player_id: supabase.auth.getUser().data.user.id,
//             competitionIdType: typeof numericCompetitionId,
//             playerIdType: typeof supabase.auth.getUser().data.user.id
//           })

//           const { data: insertData, error: joinError } = await supabase
//             .from('competitions_players')
//             .insert({
//               competition_id: numericCompetitionId,
//               player_id: supabase.auth.getUser().data.user.id
//             })
//             .select()

//           if (joinError) {
//             console.error('Detailed join error:', {
//               code: joinError.code,
//               message: joinError.message,
//               details: joinError.details,
//               hint: joinError.hint
//             })
//           } else {
//             console.log('Successfully added player:', insertData)
//           }

//           // Delete the invitation
//           const { error: deleteError } = await supabase
//             .from('competition_invitations')
//             .delete()
//             .eq('competition_id', numericCompetitionId)
//             .eq('email', supabase.auth.getUser().data.user.user_metadata.email)

//           console.log('Delete invitation result:', {
//             success: !deleteError,
//             error: deleteError?.message
//           })
//         }
//       } else {
//         console.log('Missing required data:', {
//           hasError: !!supabase.auth.getUser().error,
//           hasSession: !!supabase.auth.getUser().data.user,
//           competitionId
//         })
//       }

//       // If this was a password reset request
//       if (next === '/update-password') {
//         return NextResponse.redirect(new URL('/update-password', requestUrl.origin))
//       }

//       // For other auth flows (like signup)
//       return NextResponse.redirect(new URL('/', requestUrl.origin))
//     } catch (error) {
//       console.error('Callback error:', error)
//     }
//   }

//   // No code, redirect to home page
//   return NextResponse.redirect(new URL('/', requestUrl.origin))
// }
