import { createClient } from "@/utils/supabase/client"
import {mapSupabaseError} from "@/utils/errors"

type Competition = {
  id: string
  competition_id: string
  competitions: {
    name: string
    date_ending: string
  }
}

type CompetitionData = {
  name: string
  date_started: string
  date_ending: string
  rules: string
  has_prizes: boolean
  prizes: Array<{ place: number, reward: string }>
}

export class CompetitionService {
  private base = createClient().from("competitions")

  async getCompetitions() {
    const { data, error } = await this.base
      .select(`name, id, date_started, date_ending, created_by`)
      .order("date_ending", { ascending: false })
    if (error) throw mapSupabaseError(error)
    return data
  }

  async getCompetitionById(id: string) {
    const { data, error } = await this.base.select(`
      *,
      competitions_players(
        *,
        profiles(
          id,
          first_name,
          last_name,
          weight_tracker(weight, date_entry)
        )
      )
    `).eq("id", id).single()
    if (error) throw mapSupabaseError(error)
    return data
  }

  async getCompetitionHistory() {
    const { data, error } = await this.base
      .select(`name, id, date_started, date_ending, created_by`)
      .order("date_ending", { ascending: false })
    if (error) throw mapSupabaseError(error)
    return data
  }

  async createCompetition(competitionData: CompetitionData & { created_by?: string }) {
    const { data, error } = await this.base.insert(competitionData).select()
    if (error) throw mapSupabaseError(error)
    return data
  }

  async deleteCompetition(id: string, userId: string) {
    const { error } = await this.base.delete().eq("id", id).eq("created_by", userId)
    if (error) throw mapSupabaseError(error)
    return true
  }
}

export const competitionService = new CompetitionService()