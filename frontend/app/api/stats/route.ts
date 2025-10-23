import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'pending_approval']);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    return NextResponse.json({ total_donors: count || 0 });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
