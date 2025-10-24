import { createClient } from "@/utils/supabase/client"
import { mapSupabaseError } from "@/utils/errors"

export class ProfileService {
    private base = createClient().from("profiles")

    async getProfile(userId: string) {
        const { data, error } = await this.base.select("*").eq("id", userId)
        if (error) throw mapSupabaseError(error)
        return data
    }

    async getFirstName(userId: string) {
        const { data, error } = await this.base.select("first_name").eq("id", userId)
        if (error) throw mapSupabaseError(error)
        return data[0].first_name
    }   
}

export const profileService = new ProfileService()