import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateWeeklySummary } from '@/lib/summary';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = await generateWeeklySummary(user.id);

  return NextResponse.json({ summary });
}
