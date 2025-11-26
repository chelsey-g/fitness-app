import { createClient } from "@/utils/supabase/client"
import {mapSupabaseError} from "@/utils/errors"

export interface Challenge {
  id: string | number
  user_id: string | number
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
  id: string
  challenge_id: string
  date: string
  completed_rules: number[]
  is_complete: boolean
  notes?: string | null
  progress_photo_url?: string | null
  user_id?: string
}

export class ChallengeService {
  private base = createClient().from("challenges")
  private progressBase = createClient().from("daily_progress")

  async getChallenges(userId: string) {
    const { data, error } = await this.base.select("*").eq("user_id", userId)
    if (error) throw mapSupabaseError(error)
    return data
  }

  async getChallengeById(challengeId: string, userId: string): Promise<Challenge | null> {
    const { data, error } = await this.base
      .select("*")
      .eq("id", challengeId)
      .eq("user_id", userId)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") return null // No rows found
      throw mapSupabaseError(error)
    }
    return data as Challenge
  }

  async getDailyProgress(challengeId: string, date: string): Promise<DailyProgress | null> {
    const { data, error } = await this.progressBase
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("date", date)
      .single()
    
    if (error) {
      if (error.code === "PGRST116") return null // No rows found
      throw mapSupabaseError(error)
    }
    return data as DailyProgress
  }

  async saveDailyProgress(progressData: {
    challenge_id: string
    date: string
    completed_rules: number[]
    is_complete: boolean
    notes?: string | null
    progress_photo_url?: string | null
    user_id: string
  }, existingProgressId?: string): Promise<DailyProgress> {
    if (existingProgressId) {
      // Update existing progress
      const { data, error } = await this.progressBase
        .update(progressData)
        .eq("id", existingProgressId)
        .select()
        .single()
      
      if (error) throw mapSupabaseError(error)
      return data as DailyProgress
    } else {
      // Create new progress
      const { data, error } = await this.progressBase
        .insert(progressData)
        .select()
        .single()
      
      if (error) throw mapSupabaseError(error)
      return data as DailyProgress
    }
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

  async updateChallengeName(challengeId: string, name: string): Promise<void> {
    const { error } = await this.base
      .update({ name })
      .eq("id", challengeId)
    
    if (error) throw mapSupabaseError(error)
  }

  async updateChallengeRules(challengeId: string, rules: string[], customRules?: string[]): Promise<void> {
    const { error } = await this.base
      .update({ 
        rules,
        custom_rules: customRules || rules
      })
      .eq("id", challengeId)
    
    if (error) throw mapSupabaseError(error)
  }

  async deactivateChallenge(challengeId: string): Promise<void> {
    const { error } = await this.base
      .update({ is_active: false })
      .eq("id", challengeId)
    
    if (error) throw mapSupabaseError(error)
  }

  async restartChallenge(challengeId: string, startDate: string, endDate: string): Promise<void> {
    const { error } = await this.base
      .update({ 
        start_date: startDate,
        end_date: endDate,
        is_active: true
      })
      .eq("id", challengeId)
    
    if (error) throw mapSupabaseError(error)
  }

  async clearDailyProgress(challengeId: string): Promise<void> {
    const { error } = await this.progressBase
      .delete()
      .eq("challenge_id", challengeId)
    
    if (error) throw mapSupabaseError(error)
  }
}

export const challengeService = new ChallengeService()