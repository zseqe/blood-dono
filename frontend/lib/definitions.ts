// frontend/lib/definitions.ts
import { BloodType } from './types';

// Represents one factor in the AI explanation
export interface MatchExplanation {
  feature: string;
  value: number;
  impact: number;
}

// Basic Donor Information (Matches backend schema)
export interface Donor {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  blood_type: BloodType;
  location: string;
  status: string;
  reliability_score: number;
  last_donation_date?: string | null;
  fatigue_level: number;
}

// Ranked Donor Information (Matches backend schema)
export interface RankedDonor {
  donor: Donor;
  probability_score: number;
  rank: number;
  explanation_human: string;
  explanation_shap?: MatchExplanation[];
}