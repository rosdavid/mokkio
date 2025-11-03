-- Create saved_mockups table for storing user mockups
CREATE TABLE IF NOT EXISTS saved_mockups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on created_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_saved_mockups_created_at ON saved_mockups(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_mockups ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can restrict this later with proper authentication)
-- This is a permissive policy for development - in production, you'd want user-specific policies
CREATE POLICY "Allow all operations on saved_mockups" ON saved_mockups
  FOR ALL USING (true);