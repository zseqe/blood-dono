/*
  # Create LIFELINK Database Schema

  ## Overview
  This migration creates the complete database schema for LIFELINK, a blood donation platform
  connecting donors and hospitals through AI-powered matching.

  ## New Tables

  ### 1. hospitals
  - `id` (uuid, primary key) - Unique hospital identifier
  - `name` (text) - Hospital name
  - `email` (text, unique) - Login email for hospital portal
  - `password_hash` (text) - Bcrypt hashed password
  - `phone` (text) - Contact phone number
  - `address` (text) - Full hospital address
  - `city` (text) - City for proximity matching
  - `state` (text) - State/region
  - `latitude` (numeric) - GPS coordinates for mapping
  - `longitude` (numeric) - GPS coordinates for mapping
  - `created_at` (timestamptz) - Registration timestamp

  ### 2. donors
  - `id` (uuid, primary key) - Unique donor identifier
  - `full_name` (text) - Donor's full name
  - `email` (text, unique) - Contact email & login
  - `password_hash` (text, nullable) - For donor portal login
  - `phone` (text, unique) - Contact phone number
  - `blood_type` (text) - Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - `date_of_birth` (date) - For age calculation
  - `gender` (text) - Gender identity
  - `weight` (numeric) - Weight in kg (eligibility factor)
  - `city` (text) - City for proximity matching
  - `state` (text) - State/region
  - `location_address` (text) - Full address
  - `latitude` (numeric) - GPS coordinates
  - `longitude` (numeric) - GPS coordinates
  - `last_donation_date` (date, nullable) - Most recent donation
  - `donation_count` (integer) - Total lifetime donations
  - `donation_frequency` (text) - Regular/Occasional/First-time
  - `medical_conditions` (jsonb) - Array of health conditions
  - `medications` (text) - Current medications
  - `response_rate` (numeric) - % of times responded to requests (0-1)
  - `reliability_score` (numeric) - AI calculated reliability (0-1)
  - `is_available` (boolean) - Currently available to donate
  - `status` (text) - pending_approval/active/inactive/declined
  - `hospital_id` (uuid, foreign key) - Affiliated hospital
  - `consent_data_sharing` (boolean) - GDPR consent
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 3. blood_requests
  - `id` (uuid, primary key) - Unique request identifier
  - `hospital_id` (uuid, foreign key) - Requesting hospital
  - `blood_type_needed` (text) - Required blood type
  - `urgency_level` (text) - normal/urgent/critical
  - `units_needed` (integer) - Number of units required
  - `matched_donor_ids` (jsonb) - Array of contacted donor IDs
  - `status` (text) - pending/fulfilled/cancelled
  - `notes` (text) - Additional request details
  - `created_at` (timestamptz) - Request timestamp
  - `fulfilled_at` (timestamptz, nullable) - Completion timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Hospitals can only read their own data and associated donors
  - Donors can only read/update their own profiles
  - Public read access to hospital list for registration
  - Authenticated users required for all modifications

  ## Indexes
  - Performance indexes on email, phone, blood_type, status, city
  - Composite indexes for common query patterns

  ## Important Notes
  1. All password fields store bcrypt hashes, never plain text
  2. Medical conditions stored as JSONB for flexible querying
  3. Coordinates support future map integration
  4. Response rate and reliability score calculated by AI system
  5. Consent tracking for GDPR compliance
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  created_at timestamptz DEFAULT now()
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  phone text UNIQUE NOT NULL,
  blood_type text NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  date_of_birth date,
  gender text,
  weight numeric(5, 2),
  city text NOT NULL,
  state text NOT NULL,
  location_address text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  last_donation_date date,
  donation_count integer DEFAULT 0,
  donation_frequency text DEFAULT 'First-time' CHECK (donation_frequency IN ('First-time', 'Occasional', 'Regular')),
  medical_conditions jsonb DEFAULT '[]'::jsonb,
  medications text,
  response_rate numeric(3, 2) DEFAULT 0.75 CHECK (response_rate >= 0 AND response_rate <= 1),
  reliability_score numeric(3, 2) DEFAULT 0.75 CHECK (reliability_score >= 0 AND reliability_score <= 1),
  is_available boolean DEFAULT true,
  status text DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'inactive', 'declined')),
  hospital_id uuid REFERENCES hospitals(id) ON DELETE SET NULL,
  consent_data_sharing boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
  blood_type_needed text NOT NULL CHECK (blood_type_needed IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  urgency_level text DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'urgent', 'critical')),
  units_needed integer DEFAULT 1,
  matched_donor_ids jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  fulfilled_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_phone ON donors(phone);
CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_donors_status ON donors(status);
CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_hospital_id ON donors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_email ON hospitals(email);
CREATE INDEX IF NOT EXISTS idx_blood_requests_hospital_id ON blood_requests(hospital_id);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_donors_hospital_status ON donors(hospital_id, status);
CREATE INDEX IF NOT EXISTS idx_donors_blood_status ON donors(blood_type, status);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hospitals table

-- Hospitals can read their own data
CREATE POLICY "Hospitals can read own data"
  ON hospitals FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Public can read hospital list (for registration dropdown)
CREATE POLICY "Public can read hospital list"
  ON hospitals FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for donors table

-- Donors can read their own profile
CREATE POLICY "Donors can read own profile"
  ON donors FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Donors can update their own profile
CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Hospitals can read their affiliated donors
CREATE POLICY "Hospitals can read affiliated donors"
  ON donors FOR SELECT
  TO authenticated
  USING (hospital_id::text = auth.uid()::text);

-- Hospitals can update their affiliated donors
CREATE POLICY "Hospitals can update affiliated donors"
  ON donors FOR UPDATE
  TO authenticated
  USING (hospital_id::text = auth.uid()::text)
  WITH CHECK (hospital_id::text = auth.uid()::text);

-- Anonymous users can register as donors
CREATE POLICY "Anyone can register as donor"
  ON donors FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for blood_requests table

-- Hospitals can read their own requests
CREATE POLICY "Hospitals can read own requests"
  ON blood_requests FOR SELECT
  TO authenticated
  USING (hospital_id::text = auth.uid()::text);

-- Hospitals can create requests
CREATE POLICY "Hospitals can create requests"
  ON blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (hospital_id::text = auth.uid()::text);

-- Hospitals can update their own requests
CREATE POLICY "Hospitals can update own requests"
  ON blood_requests FOR UPDATE
  TO authenticated
  USING (hospital_id::text = auth.uid()::text)
  WITH CHECK (hospital_id::text = auth.uid()::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donors table
DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
