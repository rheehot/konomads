-- Create meetup_participants table (join table for meetups)
CREATE TABLE public.meetup_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id UUID REFERENCES public.meetups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'going', -- going, interested, not_going
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(meetup_id, user_id)
);

-- Enable RLS
ALTER TABLE public.meetup_participants ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can view participants
CREATE POLICY "Participants are viewable by everyone"
  ON public.meetup_participants
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Authenticated users can join meetups
CREATE POLICY "Authenticated users can join meetups"
  ON public.meetup_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own participation
CREATE POLICY "Users can update own participation"
  ON public.meetup_participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can leave meetups
CREATE POLICY "Users can leave meetups"
  ON public.meetup_participants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_meetup_participants_meetup_id ON public.meetup_participants(meetup_id);
CREATE INDEX idx_meetup_participants_user_id ON public.meetup_participants(user_id);

-- Create function to update participant count
CREATE OR REPLACE FUNCTION update_meetup_participants_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'going' THEN
      UPDATE public.meetups
      SET current_participants = current_participants + 1
      WHERE id = NEW.meetup_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'going' AND NEW.status = 'going' THEN
      UPDATE public.meetups
      SET current_participants = current_participants + 1
      WHERE id = NEW.meetup_id;
    ELSIF OLD.status = 'going' AND NEW.status != 'going' THEN
      UPDATE public.meetups
      SET current_participants = GREATEST(current_participants - 1, 0)
      WHERE id = NEW.meetup_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'going' THEN
      UPDATE public.meetups
      SET current_participants = GREATEST(current_participants - 1, 0)
      WHERE id = OLD.meetup_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for participant count
CREATE TRIGGER on_meetup_participant_change
  AFTER INSERT OR UPDATE OR DELETE ON public.meetup_participants
  FOR EACH ROW
  EXECUTE PROCEDURE update_meetup_participants_count();
