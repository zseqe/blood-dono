import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      hospitals: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hospitals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['hospitals']['Insert']>;
      };
      donors: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password_hash: string | null;
          phone: string;
          blood_type: string;
          date_of_birth: string | null;
          gender: string | null;
          weight: number | null;
          city: string;
          state: string;
          location_address: string | null;
          latitude: number | null;
          longitude: number | null;
          last_donation_date: string | null;
          donation_count: number;
          donation_frequency: string;
          medical_conditions: any;
          medications: string | null;
          response_rate: number;
          reliability_score: number;
          is_available: boolean;
          status: string;
          hospital_id: string | null;
          consent_data_sharing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['donors']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['donors']['Insert']>;
      };
      blood_requests: {
        Row: {
          id: string;
          hospital_id: string;
          blood_type_needed: string;
          urgency_level: string;
          units_needed: number;
          matched_donor_ids: any;
          status: string;
          notes: string | null;
          created_at: string;
          fulfilled_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['blood_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blood_requests']['Insert']>;
      };
    };
  };
};
