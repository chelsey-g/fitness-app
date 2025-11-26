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

    async updateProfile(userId: string, updates: { first_name?: string; last_name?: string }) {
        const { error } = await this.base.update(updates).eq("id", userId)
        if (error) throw mapSupabaseError(error)
    }
}

export const profileService = new ProfileService()