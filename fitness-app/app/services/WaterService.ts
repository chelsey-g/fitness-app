import { createClient } from '@/utils/supabase/client'
import { mapSupabaseError } from '@/utils/errors'

export interface WaterEntry {
  id: number
  date_entry: string
  amount_oz: number
  created_by: string
  created_at: string
}

export class WaterService {
  private base = createClient().from('water_intake');

  async getTodayEntries(userId: string, date: string): Promise<WaterEntry[]> {
    const { data, error } = await this.base
      .select('*')
      .eq('created_by', userId)
      .eq('date_entry', date)
      .order('created_at', { ascending: true });

    if (error) {
      throw mapSupabaseError(error);
    }
    return data;
  }

  async addCup(userId: string, date: string, amount_oz: number): Promise<void> {
    const { error } = await this.base
      .insert({
        created_by: userId,
        date_entry: date,
            amount_oz   : amount_oz
      })
    
    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async removeCup(entryId: number): Promise<void> {
    const { error } = await this.base.delete().eq("id", entryId);
    if (error) throw mapSupabaseError(error);
  }

  async resetDay(userId: string, date: string): Promise<void> {
    const { error } = await this.base
      .delete()
      .eq("created_by", userId)
      .eq("date_entry", date);
    
    if (error) throw mapSupabaseError(error);
  }

  async getWaterData(userId: string): Promise<WaterEntry[]> {
    const { data, error } = await this.base
      .select('*')
      .eq('created_by', userId)
      .order('date_entry', { ascending: false });
    if (error) throw mapSupabaseError(error);
    return data;
  }
}

export const waterService = new WaterService();

