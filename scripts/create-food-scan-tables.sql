-- Create gut_history table for user gut health data
CREATE TABLE IF NOT EXISTS gut_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  known_triggers TEXT[] DEFAULT '{}',
  avg_stool_type_7d INTEGER DEFAULT 4,
  flare_active BOOLEAN DEFAULT false,
  symptoms_7d JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_scans table for storing scan results
CREATE TABLE IF NOT EXISTS food_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  items JSONB DEFAULT '[]',
  gut_score INTEGER,
  reasons TEXT[] DEFAULT '{}',
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gut_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_scans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own gut history" ON gut_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gut history" ON gut_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own food scans" ON food_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food scans" ON food_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
