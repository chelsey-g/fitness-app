import { createClient } from "@/utils/supabase/client"
import { mapSupabaseError } from '@/utils/errors'


export type WeightEntry = {
  id: number
  date_entry: string
  weight: number
  created_by: string
  created_at: string
}

export class WeightService {
  private base = createClient().from("weight_tracker");

  async addWeightEntry(userId: string, date: string, weight: number): Promise<void> {
    const { error } = await this.base
      .insert({
        date_entry: date,
        weight: weight,
        created_by: userId
      })
    
    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async getWeightEntries(userId: string, limit?: number): Promise<WeightEntry[]> {
    let query = this.base
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    
    if (error) {
      throw mapSupabaseError(error);
    }
    
    return data || [];
  }

  async getMonthlyWeightEntries(userId: string, startDate: string, endDate: string): Promise<WeightEntry[]> {
    const { data, error } = await this.base
      .select('*')
      .eq('created_by', userId)
      .gte('date_entry', startDate)
      .lte('date_entry', endDate)
      .order('date_entry', { ascending: true });

    if (error) {
      throw mapSupabaseError(error);
    }

    return data
  }

  async getLoadedDates(userId: string): Promise<string | null | undefined> {
    const { data, error } = await this.base
      .select('date_entry')
      .eq('created_by', userId)
      .order('date_entry', { ascending: false })
      .limit(1);

    if (error) {
      throw mapSupabaseError(error);
    }

    return data?.[0]?.date_entry || null
  }


  async deleteWeightEntry(entryId: number): Promise<void> {
    const { error } = await this.base.delete().eq("id", entryId);
    if (error) throw mapSupabaseError(error);
  }

  async updateWeightEntry(entryId: number, weight: number, date: string): Promise<void> {
    const { error } = await this.base
      .update({ weight, date_entry: date })
      .eq("id", entryId);
    
    if (error) throw mapSupabaseError(error);
  }

  async getWeightTrackerData(userId: string): Promise<WeightEntry[]> {
    const { data, error } = await this.base
      .select('weight, date_entry')
      .eq('created_by', userId)
    
    if (error) throw mapSupabaseError(error);
    return data as WeightEntry[];
  }
}

export const weightService = new WeightService();
