import { NextResponse } from "next/server"
import { AuthService } from "@/app/services/AuthService"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient();
const authService = new AuthService(supabase);

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)

  await authService.signOut()

  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}
