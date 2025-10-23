/*
  # Fix Hospital Insert Policy

  ## Changes
  - Add policy to allow anonymous users to insert hospitals (for seeding)
  - This is a temporary policy that should be removed or restricted in production
*/

-- Allow anonymous inserts for hospital seeding
CREATE POLICY "Allow anonymous hospital insert for seeding"
  ON hospitals FOR INSERT
  TO anon
  WITH CHECK (true);
