import { createClient } from "@/utils/supabase/client"
import { mapSupabaseError } from "@/utils/errors"

interface goal {
    id: number
    goal_weight: number
    goal_date: string
  }

  export class GoalService {
    private base = createClient().from("profile_goals");

    async getGoals(userId: string): Promise<goal[]> {
      const { data, error } = await this.base
        .select("*")
        .eq("profile_id", userId)
        .order("goal_date", { ascending: false });
      if (error) throw mapSupabaseError(error);
      return data;
    }

    async addGoal(userId: string, goalWeight: number, goalDate: string): Promise<void> {
      const { error } = await this.base
        .insert({
          goal_weight: goalWeight,
          goal_date: goalDate,
          profile_id: userId,
        })
      if (error) throw mapSupabaseError(error);
    }

    async deleteGoal(userId: string, goalId: number): Promise<void> {
      const { error } = await this.base
        .delete()
        .eq("id", goalId)
        .eq("profile_id", userId)
      if (error) throw mapSupabaseError(error);
    }
    
    // async updateGoal(userId: string, goalId: number, goalWeight: number, goalDate: string): Promise<void> {
    //   const { error } = await this.base
    //     .update({
    //       goal_weight: goalWeight,
    //       goal_date: goalDate,
    //     })
    //   if (error) throw mapSupabaseError(error);
    // }
  }

  export const goalService = new GoalService();