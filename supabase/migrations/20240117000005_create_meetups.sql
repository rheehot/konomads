-- Create meetups table
CREATE TABLE public.meetups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  meetup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 1,
  status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can view meetups
CREATE POLICY "Meetups are viewable by everyone"
  ON public.meetups
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Authenticated users can create meetups
CREATE POLICY "Authenticated users can create meetups"
  ON public.meetups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Organizers can update their meetups
CREATE POLICY "Organizers can update own meetups"
  ON public.meetups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Organizers can delete their meetups
CREATE POLICY "Organizers can delete own meetups"
  ON public.meetups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_meetups_updated_at
  BEFORE UPDATE ON public.meetups
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_meetups_city_id ON public.meetups(city_id);
CREATE INDEX idx_meetups_user_id ON public.meetups(user_id);
CREATE INDEX idx_meetups_meetup_date ON public.meetups(meetup_date);
CREATE INDEX idx_meetups_status ON public.meetups(status);
