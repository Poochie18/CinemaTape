-- Create tables for CinemaTape

-- Watched Films Table
CREATE TABLE watched_films (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  watch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  note TEXT,
  poster TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Watch Later Table
CREATE TABLE watch_later (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE watched_films ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

-- Policies for watched_films
CREATE POLICY "Users can view their own watched films"
  ON watched_films FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watched films"
  ON watched_films FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watched films"
  ON watched_films FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watched films"
  ON watched_films FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for watch_later
CREATE POLICY "Users can view their own watch later list"
  ON watch_later FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own watch later list"
  ON watch_later FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch later list"
  ON watch_later FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watch later list"
  ON watch_later FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX watched_films_user_id_idx ON watched_films(user_id);
CREATE INDEX watched_films_watch_date_idx ON watched_films(watch_date);
CREATE INDEX watch_later_user_id_idx ON watch_later(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for watched_films
CREATE TRIGGER update_watched_films_updated_at
  BEFORE UPDATE ON watched_films
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
