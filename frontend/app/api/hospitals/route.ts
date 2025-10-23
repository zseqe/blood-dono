import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: hospitals, error } = await supabase
      .from('hospitals')
      .select('id, name, city, state, address')
      .order('name');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
    }

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Hospitals fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
