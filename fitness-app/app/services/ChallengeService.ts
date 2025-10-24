import { createClient } from "@/utils/supabase/client"
import {mapSupabaseError} from "@/utils/errors"

export interface Challenge {
  id: number
  user_id: number
  name: string
  tier: "Soft" | "Medium" | "Hard"
  start_date: string
  end_date: string
  rules: string[]
  is_active: boolean
  custom_rules?: string[]
  created_at: string
}

export interface DailyProgress {
  id: number
  challenge_id: number
  date: string
  completed_rules: number[]
  is_complete: boolean
}

export class ChallengeService {
  private base = createClient().from("challenges")

  async getChallenges(userId: number) {
    const { data, error } = await this.base.select("*").eq("user_id", userId)
    if (error) throw mapSupabaseError(error)
    return data
  }

  async createChallenge(userId: string, name: string, tier: string, startDate: string, endDate: string, rules: string[], customRules?: string[]) {
    const { data, error } = await this.base.insert({
      user_id: userId,
      name: name,
      tier: tier,
      start_date: startDate,
      end_date: endDate,
      rules: rules,
      is_active: true,
      custom_rules: customRules ? customRules : null
    })
    if (error) throw mapSupabaseError(error)
    return data
  }
}

export const challengeService = new ChallengeService()