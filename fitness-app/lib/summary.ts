import { createClient } from '@/utils/supabase/server';

export async function generateWeeklySummary(userId: string): Promise<string> {
  const supabase = await createClient();

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const { data: progressData, error: progressError } = await supabase
    .from('daily_progress')
    .select('date, is_complete, completed_rules')
    .eq('user_id', userId)
    .gte('date', sevenDaysAgo.toISOString().split('T')[0])
    .lte('date', today.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (progressError) {
    console.error('Error fetching daily progress:', progressError);
    return 'Error generating weekly summary.';
  }

  if (!progressData || progressData.length === 0) {
    return 'No activity recorded in the last 7 days.';
  }

  let completedHabits = 0;
  progressData.forEach(day => {
    completedHabits += day.completed_rules.length;
  });

  let currentStreak = 0;
  let currentDate = new Date();
  for (let i = 0; i < progressData.length; i++) {
    const progressDate = new Date(progressData[i].date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(currentDate.getDate() - i);

    if (
      progressDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0] &&
      progressData[i].is_complete
    ) {
      currentStreak++;
    } else {
      break;
    }
  }

  const summary = `Here's your weekly summary:
- You've completed ${completedHabits} habits in the last 7 days.
- Your current streak is ${currentStreak} days.

Keep up the great work!`;

  return summary;
}
