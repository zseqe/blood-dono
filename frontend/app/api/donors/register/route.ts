import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      full_name,
      email,
      phone,
      blood_type,
      date_of_birth,
      gender,
      weight,
      city,
      state,
      location_address,
      medical_conditions,
      medications,
      hospital_id,
    } = body;

    if (!full_name || !email || !phone || !blood_type || !city || !state || !hospital_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: existingDonor } = await supabase
      .from('donors')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingDonor) {
      return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('donors')
      .insert([
        {
          full_name,
          email,
          phone,
          blood_type,
          date_of_birth,
          gender,
          weight: weight ? parseFloat(weight) : null,
          city,
          state,
          location_address,
          medical_conditions: medical_conditions || [],
          medications,
          hospital_id,
          status: 'pending_approval',
          is_available: true,
          consent_data_sharing: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json({ error: 'Failed to register donor' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Registration successful',
      donor: data,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
