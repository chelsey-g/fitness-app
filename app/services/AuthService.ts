// import { createClient } from "@/utils/supabase/client"
import { mapSupabaseError } from "@/utils/errors"

export class AuthService {
  private client: any;

  constructor(client:any) {
    this.client = client; 
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password })
    if (error) throw mapSupabaseError(error)
    return data
  }

  async signOut() {
    const { error } = await this.client.auth.signOut()
    if (error) throw mapSupabaseError(error)
    return
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, username: string) {
    const { data, error } = await this.client.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName, username } } })
    if (error) throw mapSupabaseError(error)
    return data
  }

  // async updateEmail(email: string) {
  //   const { data, error } = await this.base.updateUser({ email })
  //   if (error) throw mapSupabaseError(error)
  //   return data
  // }
  
  // async updatePassword(password: string) {
  //   const { data, error } = await this.base.updateUser({ password })
  //   if (error) throw mapSupabaseError(error)
  //   return data
  // }

  async resetPassword(email: string, origin?: string) {
    const redirectTo = origin 
      ? `${origin}/auth/callback?redirect_to=/protected/reset-password`
      : undefined
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) throw mapSupabaseError(error)
    return
  }

  async getUser() {
    const { data, error } = await this.client.auth.getUser()
    if (error) throw mapSupabaseError(error)
    return data.user;
  }

  async updateUser(password: string) {
    const { data, error } = await this.client.auth.updateUser({ password })
    if (error) throw mapSupabaseError(error)
    return data
  }

  // async getSession() {
  //   const { data, error } = await this.base.getSession()
  //   if (error) throw mapSupabaseError(error)
  //   return data
  // }
}

// export const authService = new AuthService(supabase)